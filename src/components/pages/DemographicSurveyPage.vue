<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useStepRoute()

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'


if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    smilestore.saveData()
    router.push(goto)
}
</script>


<template>
    <div class="page">
        <div class="formcontent">
            <h3 class="is-size-3 has-text-weight-bold">Demographic Information</h3>
            <p class="is-size-5">
                We kindly request some information about you which we can use to understand
                aggregate differences between individuals.  
            </p>
            <hr>
            <div class="columns">        
                <div class="column is-one-third">
                    <div class="formsectionexplainer">
                        <h3 class="is-size-6 has-text-weight-bold">Basic Info</h3>
                        <p class="is-size-7">First, we need some basic information.  We collected this demographic information.</p>
                    </div>
                </div>
                <div class="column">
                    <div class="box is-shadowless formbox">
                        <FormKit type="date"
                                 label="Date of Birth"
                                 placeholder="1/1/1960"
                                 help="Enter your birthday (required)"
                                 validation="required"
                                 validation-visibility="live"/>
                        <FormKit type="select" 
                                 label="Gender" 
                                 help="Enter your self-identified gender (required)"
                                 placeholder="Select an option"
                                 :options="['Male', 'Female', 'Other']"/>
                        <FormKit type="select" 
                                 label="Race" 
                                 help="Enter the race that best describes you (required)"
                                 placeholder="Select an option"
                                 :options="['Asian', 'Black/African American', 'Caucasian/White', 'Native American', 'Mixed Race', 'Pacific Islander/Native Hawaiian']"/>
                        <FormKit type="select" 
                                 label="Are you hispanic?"
                                 help="Do you consider yourself hispanic? (required)"
                                 :options="['Yes', 'No']"/>
                        
                    </div>
                </div>
            </div>
            <hr>
            <div class="columns">        
                <div class="column is-one-third">
                    <div class="formsectionexplainer">
                        <h3 class="is-size-6 has-text-weight-bold">Psychological Information</h3>
                        <p class="is-size-7">First, we need some basic information.  We collected this demographic information.</p>
                    </div>
                </div>
                <div class="column">
                    <div class="box is-shadowless formbox">
                        <FormKit type="select" 
                                 label="Are you fluent in English?"
                                 help="Are you able to speak and understanding English?"
                                 placeholder="Select an option"
                                 :options="['Yes', 'No']"/>
                        <FormKit type="select" 
                                 label="Do you have normal vision (or corrected to be normal)?"
                                 help="Do you have normal vision?"
                                 placeholder="Select an option"
                                 :options="['Yes', 'No']"/>
                        <FormKit type="select" 
                                 label="Are you color blind?"
                                 help="Do you have any color blindness?"
                                 placeholder="Select an option"
                                 :options="['Yes', 'No']"/>
                        <FormKit type="select" 
                                 label="Have you been diagnosed with a learning disability (e.g., dyslexia, dysclaculia)?"
                                 help="Do you have a diagnosed learning disability?"
                                 placeholder="Select an option"
                                 :options="['Yes', 'No']"/>
                        <FormKit type="select" 
                                 label="Have you been diagnosed with a neurodevelopmental disorder (e.g., autism, tic disorder)?"
                                 help="Do you have a diagnosis of a neurodevelopmental disorder?"
                                 placeholder="Select an option"
                                 :options="['Yes', 'No']"/>
                        <FormKit type="select" 
                                 label="Have you been diagnosed with a psychiatric disorder (e.g., anxiety, depression, OCD)?"
                                 help="Do you have diagnosis of a psychiatric disorder?"
                                 placeholder="Select an option"
                                 :options="['Yes', 'No']"/>
                    </div>
                </div>
            </div>
            <hr>
            <div class="columns">        
                <div class="column is-one-third">
                    <div class="formsectionexplainer">
                        <h3 class="is-size-6 has-text-weight-bold">Household Info</h3>
                        <p class="is-size-7">First, we need some basic information.  We collected this demographic information.</p>
                    </div>
                </div>
                <div class="column">
                    <div class="box is-shadowless formbox">
                        <FormKit type="select" 
                                 label="Country"
                                 placeholder="Select an option"
                                 help="Select the country in which you reside."
                                 :options="['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua & Deps','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Rep','Chad','Chile','China','Colombia','Comoros','Congo','Congo {Democratic Rep}','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland {Republic}','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea North','Korea South','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar, {Burma}','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russian Federation','Rwanda','St Kitts & Nevis','St Lucia','Saint Vincent & the Grenadines','Samoa','San Marino','Sao Tome & Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe']"
                                 />
                        <FormKit type="text" 
                                 label="Zipcode/Postal Code"
                                 help="Select zipcode or postal code of your primary residence."/>
                        <FormKit type="select" 
                                 label="Highest level of education"
                                 placeholder="Select an option"
                                 help="What is your highest level of schooling that you completed?"
                                 :options="['No Formal Qualifications', 'Secondary Education (ie. GED/GCSE)', 'High School Diploma (A-levels)', 'Technical/Community College', 'Undergraduate Degree (BA/BS/Other)', 'Graduate Degree (MA/MS/MPhil/Other)', 'Doctorate Degree (PhD/Other)', 'Don’t Know/Not Applicable']"
                                 />
                        <FormKit type="select" 
                                 label="Enter your approximate household income."
                                 help="What is your approximate household income?"
                                 placeholder="Select an option"
                                 :options="['Less than $20,000', '$20,000–$39,999', '$40,000–$59,999', '$60,000–$79,999', '$80,000–$99,999', '$100,000–$199,999', '$200,000–$299,999', '$300,000–$399,999', '$400,000–$499,999', '$500,000+', 'I don’t know', 'I prefer not to answer']
"/>
                    </div>
                </div>
            </div>
            <div class="has-text-right">
            <button class="button is-warning" id='finish' @click="finish(next)">Continue &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
            </div> 
        </div>
    </div>
</template>



<style>

:root {
    --fk-bg-input: #fff;
    --fk-max-width-input: 100%;
}

.formbox {
    border: 1px solid #dfdfdf;
    text-align: left;
    background-color: rgb(248, 248, 248);
}


.formkit-input  select {
    background-color: #fff;
}


.formcontent {
    width: 80%;
    margin: auto;
    margin-bottom: 40px;
    padding-bottom: 200px;
    text-align: left;
}
.formsectionexplainer {
    text-align: left;
    color: #777;
}
</style>