<script setup>
    // import '@/seed'
    import { useRouter, useRoute } from 'vue-router'
    import useTimelineStepper from '@/composables/timelinestepper'
    import useSmileStore from '@/stores/smiledata'
 // get access to the global store
    
    const router = useRouter()
    const route = useRoute()
    const smilestore = useSmileStore()
    const { next, prev } = useTimelineStepper()
    
    smilestore.global.page_bg_color = '#fff'
    smilestore.global.page_text_color = '#000'
    smilestore.global.status_bar_bg_color = '#fff'
    smilestore.global.status_bar_text_color = '#000'
    
    if(route.meta.progress) smilestore.global.progress = route.meta.progress
    
    function finish(goto) { 
        // smilestore.setConsented()
        // smilestore.saveData()
        if(goto) router.push(goto)
    }
    </script>
    
    <template>
        <div class="page">
            <div class="sizer border-animation">
                <div class="info">
                    <span class="is-size-2"><FAIcon icon="fa-solid fa-arrows-up-down-left-right "></FAIcon></span>
                    <h1 class="is-size-4">Please adjust the size of your browser until the edges 
                        of this box are all visible.</h1>
                    <hr>
                    <div class="is-8 is-size-7 has-text-left note">
                        <b>Warning</b>: If you can't resize your window and see the entire box please click the red
                        "withdraw" button at the top of the page and return the task.  You need to be able
                        view the entire page at once.
                    </div>
                    <hr>
                    <br><br>
                    <button class="button is-success" id='finish' @click="finish(next())">It is visible now, I'm ready &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                </div>
            </div>
        </div>
    </template>
    
    <style scoped>
    .info {
        width: 65%;
        padding-top: 30px;
        margin: auto;
        color: rgb(18, 53, 90);
    }
    .note {
        color: rgb(64, 91, 121);
    }
    hr {
        background-color: rgb(18, 53, 90);
    }
    .sizer { 
        background-color: rgb(208, 242, 251) ;
        /*border: 2px dashed red;*/
        width: v-bind(smilestore.config.windowsizer_request.width);
        height: v-bind(smilestore.config.windowsizer_request.height);
        margin-left: auto;
        margin-right: auto;
        vertical-align: center;
        padding-top: auto;
        padding: 20px;
        align: center;
    }
    
    .border-animation {
    background-image: linear-gradient(90deg, rgb(18, 53, 90) 50%, transparent 50%), linear-gradient(90deg, rgb(18, 53, 90) 50%, transparent 50%), linear-gradient(0deg, rgb(18, 53, 90) 50%, transparent 50%), linear-gradient(0deg, rgb(18, 53, 90) 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
    background-position: left top, right bottom, left bottom, right   top;
    animation: border-dance 0.5s infinite linear;
    }
    @keyframes border-dance {
        0% {
        background-position: left top, right bottom, left bottom, right   top;
        }
        100% {
        background-position: left 15px top, right 15px bottom , left bottom 15px , right   top 15px;
        }
    }
    
    </style>