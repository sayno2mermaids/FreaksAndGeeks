libname code1 'u:\CODEATHON';
PROC IMPORT OUT= WORK.dimension 
            DATAFILE= "U:\CODEATHON\dimension_set.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
	 GUESSINGROWS=50;
     DATAROW=2; 
RUN;

PROC IMPORT OUT= WORK.measure
            DATAFILE= "U:\CODEATHON\measure.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
	 GUESSINGROWS=50;
     DATAROW=2; 
RUN;

PROC IMPORT OUT= WORK.result 
            DATAFILE= "U:\CODEATHON\result.csv" 
            DBMS=CSV REPLACE;
     GETNAMES=YES;
	 GUESSINGROWS=100000;
     DATAROW=2; 
RUN;


data work.measure_recode;
set work.measure;
name1=strip(scan(name, 1, '.'));
name2=strip(scan(name1,1,'_'));
name3=strip(scan(name1,2,'_'));
name4=strip(scan(name1,3,'_'));
name5=strip(scan(name1,4,'_'));
name_end=strip(name4)||"!"||strip(name5);
run;


proc sort data=work.measure;
by measure_id;
run;

proc sort data=work.result NODUPKEY DUPOUT=DUP;
by measure_id SET_ID value;
run;

proc contents data=work.dimension;
run;

proc sort data=work.dimension;
by set_id;
run;



data work.measure_result;
merge work.measure work.result;
by measure_id;
run;

proc sort data=work.measure_result;
by set_id;
run;

data work.measure_dimension_result;
merge work.measure_result work.dimension;
by set_id;
run;

proc sort data=work.measure_dimension_result;
by measure_id set_id;
run;

