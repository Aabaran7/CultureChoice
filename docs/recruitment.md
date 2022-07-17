# :raising_hand: Recruiting Participants

## Prolific

From the Prolific dashboard, either click ‘New study’, or duplicate a previous study from within the ‘Completed’ tab on the sidebar (click ‘Action’, then ‘Duplicate’).

- Set the URL for your experiment to the IP address of the server using the format `http://<ip-address>:<port-number>/`. (To find the IP address of the server, see here.) Make sure you include the forward slash, `/`, at the end, and make sure that you do not include the angle brackets.
- Under ‘How to record Prolific IDs’, select the option ‘I’ll use URL parameters’.
- Make sure Prolific will pass the following variables: PROLIFIC_PID, STUDY_ID, and SESSION_ID.
- At the end of the three steps above, the URL in the box under ‘What is the URL of your study?’ should look something like: 

`http://128.100.100.100:9000/?PROLIFIC_PID=[[%PROLIFIC_PID%]]&STUDY_ID=[[%STUDY_ID%]]&SESSION_ID=[[%SESSION_ID%]]`


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