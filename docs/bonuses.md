# :moneybag: Computing Bonuses

When we assign performance-related bonuses to participants, 
we cannot trust the client data to assign the bonus amount 
directly because a bad actor could alter the code running in the 
browser to arbitrarily alter the value.

Instead, a better approach is to run some code on the server (i.e., some process in the cloud) which runs the logic to compute the bonus and writes it to an unmodifiable
part of the data record for a user.

In <SmileText />, this is handled using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/?authuser=0#implementation_paths).  This is a server technology, ironically called "serverless" where you upload small Javascript functions that can perform limited computation to the Google Cloud.  Google cloud handles the maintenance and scaling of these functions in tiny low-resource sandbox cloud computing environments.  These environments are started and stopped by Google according to arcane logic which balances cost and need.

This guide gives you an overview of using Cloud functions to compute server-side functions.  Although this guide is predicated on the most common use case -- computing bonuses -- it can also be used to design stimuli and enable other custom functionality to your experiment.

## Overview of Cloud Functions

Google Cloud Functions are little bits of Javascript (or other languages) that run in the cloud based on **triggers**.  Triggers can be web requests (like accessing a special URL that triggers the code to run) or can be **events** within the Google Firebase system including things having to do with writing or creating new documents in Firestore.

The basic use case then is to deploy a function that runs each time a data file/document is marked as completed and then compute the bonus based on that data file, and write that value to a place within the Google Firestore which is off limits to read/write access by public web clients.  

This is helped by the fact that Google Cloud Functions have unlimited read-write access to the Firestore database but web clients can be configured in various ways to only have certain read/write permissions to particular documents.

## Install the Google Cloud Command Line Tool

In order to develop, test, and deploy Google Cloud Functions you need to install the google command line tool using brew:

```
brew install --cask google-cloud-sdk
```

Once this is installed then login to firebase using your Google user account:

```
firebase login
```

:::warning Important
You need to have the <SmileText /> Firestore project added to your Google Firebase Cloud Console.  Contact Todd if you are in the gureckislab.
:::


## Write/Edit a Cloud Function

## Test the Cloud Function

## Deploy the Cloud Function

## 