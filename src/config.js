// config.js

// global configuration options for the smile app

export default {
    project_name: import.meta.env.VITE_PROJECT_NAME, // autocompute this on intitialization
    project_version: '1.2.23', // autocompute this all the time
    git_repo: import.meta.env.VITE_GIT_REPO,
    last_git_commit: import.meta.env.VITE_GIT_HASH, // autocompute this all the time
    last_git_commit_msg: import.meta.env.VITE_GIT_MSG, 
    browser_exclude: import.meta.env.VITE_BROWSER_EXCLUDE,
    allow_repeats: import.meta.env.VITE_ALLOW_REPEATS,
    bug_reports: import.meta.env.VITE_BUG_REPORTS,
    deploy_url: import.meta.env.VITE_DEPLOY_URL_BASE + import.meta.env.VITE_PROJECT_NAME, // auto compute this
    services_allowed: import.meta.env.VITE_SERVICES_ALLOWED,
    firebaseConfig : {
        apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
        appId: import.meta.env.VITE_FIREBASE_APPID
    }
}