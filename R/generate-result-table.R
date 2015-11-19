# R script for DQA-codathon 2015
#
# Generate table of measures and results for a specific dataset
#
# Created by: Raibatak Das (github.com/dododas)

#setwd("~/CUDenver/Research/CurrentProjects/dqa-codathon/src")
library(dplyr)

# Choose the dataset
data.dir = "../data/chco_dq/"

dims = read.csv(file.path(data.dir, "dimension_set.csv"), stringsAsFactors=F)
measure = read.csv(file.path(data.dir, "measure.csv"), stringsAsFactors=F)
result = read.csv(file.path(data.dir, "result.csv"), stringsAsFactors=F)

# Define a function to look up the measure name from measure id
get_measure_name = function(meas_id){
    name = measure[measure$measure_id == meas_id, "name"]
    return(name)
}

# Remove missing values from results, look up measure name for each measure
# and sort results by measure id and set id
# The result is a data frame with the following columns:
# measure id | set id | measure name | result name | value
#
result.table =
    result %>%
    filter(!is.na(value)) %>% # Remove missing values
    rowwise() %>%
    mutate(measure_name = get_measure_name(measure_id)) %>% # look up measure name
    arrange(measure_id, set_id) # Order by measure_id -> set_id
result.table = result.table[c("measure_id", "set_id", "measure_name",
                              "result_name", "value")] # Rearrange columns
# Save results table as csv
# **NOTE:** Change the filename in the next line to match the dataset above
write.csv(result.table, "../results/chco_result_table.csv", row.names=F)
