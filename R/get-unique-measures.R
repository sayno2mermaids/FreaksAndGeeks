# R script for DQA-codathon 2015
#
# Extract unique measures from each dataset and create a master csv file
#
# Created by: Raibatak Das (github.com/dododas)


#setwd("~/CUDenver/Research/CurrentProjects/dqa-codathon/src")
library(dplyr)
library(ggplot2)

# ** NOTE: Modify the following code block to specify the correct path to
# the dq-cdm folders
data.dirs = c("../data/phis_dq", "../data/ms_dq", "../data/synpuf_dq",
              "../data/chco_dq", "../data/pcornet_dq")
# Specify a label for each dataset
data.labels = c("phis", "minisentinel", "synpuf", "chco", "pcornet")

# For each dataset, read the results table, remove missing values, and compile
# list of unique measures that remain. These are measures for which there is at
# least one reported value in the results table
# The final result is a data frame with the following columns:
# dataset | measure id | measure name
#
master.list = data.frame(dataset = character(), measure.id = integer())
for (i in 1:length(data.dirs)){
    data.source = data.dirs[i]
    result = read.csv(file.path(data.source, "result.csv"), stringsAsFactors=F)
    measure = read.csv(file.path(data.source, "measure.csv"), stringsAsFactors=F)
    result = filter(result, !is.na(value)) # Remove rows with missing values
    unique.measures = sort(unique(result$measure_id))
    n = length(unique.measures) # How many unique measures
    dataset.label = rep(data.labels[i], n)
    # Generate data frame
    measure.list = filter(measure, measure_id %in% unique.measures) %>%
        select(measure_id, name) %>%
        mutate(dataset = dataset.label)
    master.list = rbind(master.list, measure.list) # Attach
}

# Rearrange columns, sort the measure by measure ID
master.list =
    master.list[c("dataset", "measure_id", "name")] %>%
    arrange(dataset, measure_id)
# Save as a csv file.
# NOTE: Change the output filename in the next line if necessary
write.csv(master.list, "../results/measure_table_master.csv", row.names=F)

# How many unique measures in each dataset
count(master.list, dataset)
