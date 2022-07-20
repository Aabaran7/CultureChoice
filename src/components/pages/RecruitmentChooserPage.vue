<script setup>
</script>

<template>
    <div class="page">
        
        <div class="content">
            <h1 class="title is-3">Welcome to Smile dev 👩‍💻 mode !</h1>
            <p class="is-size-5 has-text-left">
                Please choose how you would like to test run your application.
                You can choose between these options:
                <br>
                <hr>
                <h3 class="title is-5">Prolific.ac</h3>
                <p class="is-size-6">
                Prolific is a platform for online experiments with slightly higher overall quality than AMT.
                </p>
                <a href="/#/welcome/?PROLIFIC_PID=XXXX&STUDY_ID=XXXX&SESSION_ID=XXXXX" class="button is-info is-small" id='prolific_tester'>Random Fake Prolific User &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
                <hr>
                <h3 class="title is-5">Mechanical Turk</h3>
                <p class="is-size-6">
                Mechanical Turk is the wild-west 🤠 of online crowd labor markets.  
                </p>
                <a href="/#/mturk/?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=123RVWYBAZW00EXAMPLE&turkSubmitTo=https://www.mturk.com/&workerId=AZ3456EXAMPLE" class="button is-danger is-small" id="amt_tester_preview">AMT Preview Mode &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
                <a href="/#/mturk/?assignmentId=123RVWYBAZW00EXAMPLE456RVWYBAZW00EXAMPLE&hitId=123RVWYBAZW00EXAMPLE&turkSubmitTo=https://www.mturk.com/&workerId=AZ3456EXAMPLE" class="button is-warning is-small" id="amt_tester">Random Fake AMT User &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a> 
                <hr>
                <h3 class="title is-5">Citizen Science</h3>
                <p class="is-size-6">
                Citizen Science is a stand-in for a posssible future platform run by the lab.
                </p>
                <a href="/#/welcome/?CITIZEN_ID=XXXXX&CITIZEN_TASK_ID=123RVWYBAZW00EXAMPLE&CITIZEN_ASSIGN_ID=AZ3456EXAMPLE" class="button is-success is-small" id="citizen_tester">Random Fake Citizen Science User &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
            </p>            
        </div>

    </div>
</template>

<style>
.content {
    width: 60%;
    margin: auto;
}

.content a {
    margin-left: 10px;
}
</style>