# :raising_hand: Recruiting Participants

## Prolific

From the Prolific dashboard, either click ‘New study’, or duplicate a previous study from within the ‘Completed’ tab on the sidebar (click ‘Action’, then ‘Duplicate’).

- Set the URL for your experiment to the IP address of the server using the format `http://<hostname>:<port-number>/`. (T Make sure you include the forward slash, `/`, at the end, and make sure that you do not include the angle brackets.
- Under ‘How to record Prolific IDs’, select the option ‘I’ll use URL parameters’.
- Make sure Prolific will pass the following variables: PROLIFIC_PID, STUDY_ID, and SESSION_ID.
- At the end of the three steps above, the URL in the box under ‘What is the URL of your study?’ should look something like: 

`http://128.100.100.100:9000/?PROLIFIC_PID=[[%PROLIFIC_PID%]]&STUDY_ID=[[%STUDY_ID%]]&SESSION_ID=[[%SESSION_ID%]]`


At the end you redirect the participant to 
https://app.prolific.co/submissions/complete?cc=HZCQS9MX
The completion code doesn't have to be anything in particular but there is an 

## Cloud Research

[Cloud Research](https://www.cloudresearch.com) previously known as TurkPrime is a service that runs on top of Amazon Mechanical Turk that offers some additional screening and demographic information about workers.  The most relevant service for psychologists is probably the [MTurk Toolkit](https://www.cloudresearch.com/products/turkprime-mturk-toolkit/).  Essentially, CloudResearch pre-screens workers on Mechanical Turk to flag possible bots as well as reliably inattentive participants.  The idea is that using their technology you can get higher quality data than using the low-level MTurk API.  

Cloud Research takes several steps to improve the general data quality for surveys including presenting workers questions at various points which they check for consistency (did the subject las week answer this question the same as today?).  The also can perform some demographic sampling/filters if you need samples from particular population groups.

They also provide GUI tools for posting HITs on Mechanical Turk that simplify recruitment.

To get started you first need to create an account on [CloudResearch.com](https://account.cloudresearch.com/Account/Login)

Next, you have to connect your Mechanical Turk account to Cloud Research effectively granting them access to post and approve HITs on your behalf.  Cloud Research provides instructions on doing this [here](https://cloudresearch-com.s3.amazonaws.com/files/Instructions+for+linking+MTurk+and+CloudResearch+Accounts.pdf).  If you are in the gureckislab you will need to ask Todd to add you to our lab MTurk account.

To create studies you use the intuitive study builder.  There are many custom fields that you can use to configure your study including payment, demographic restrictions, privacy-enhancing features, etc... However, the most important is to post the correct link to the study.  Here is an example.  But basically it is


At the end of CloudResearch studies you display to the worker a completion code that they paste into the study window.  



## Mechanical Turk

Mturk adds these parameters to your URL when a participant accepts the hit.

`http://128.100.100.100:9000/?assignmentId=123RVWYBAZW00EXAMPLE456RVWYBAZW00EXAMPLE&hitId=123RVWYBAZW00EXAMPLE&turkSubmitTo=https://www.mturk.com/&workerId=AZ3456EXAMPLE`


- Preview mode:

`http://128.100.100.100:9000?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=123RVWYBAZW00EXAMPLE&turkSubmitTo=https://www.mturk.com/&workerId=AZ3456EXAMPLE`

This should just show a "advertisement" for the study.
In psiturk the advertisement checks to see if user has already completed the task and if so tells them they can't do it.
Could do this using local storage (cheap, easily bypassed) or by checking the database (expensive)



## Crowd-sourcing

In the future the lab might make a citizen science recruitment portal.  To support this we provides a similar API to prolific/AMT with the more generic CITIZEN_ID type identity variables:

`/?CITIZEN_ID=XXXXX&CITIZEN_TASK_ID=123RVWYBAZW00EXAMPLE&CITIZEN_ASSIGN_ID=AZ3456EXAMPLE`