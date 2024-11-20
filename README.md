# Courses built by Xavier Portilla Edo

This repository holds Courses created by [Xavier Portilla Edo](https://github.com/xavidop) in collaboration
with contributors from the community. In case you are wondering what Codelabs are, take a look [here](https://codelabs.developers.google.com/). This
repository is primarily maintained by [Xavier Portilla Edo](https://github.com/xavidop). 

This repository builds static web pages using Hugo, and the generated static web pages are hosted on Netlify. The applied theme makes the appearance of the pages similar to [google codelabs](https://codelabs.developers.google.com/). This Hugo theme was originally ported by [nekocode](https://github.com/nekocode/codelabs-hugo-theme), and customized by [Chansung Park](https://github.com/deep-diver/codelabs-hugo-theme).

# Guide

## How to contribute as a writer

1. Install Hugo ([instructions](https://gohugo.io/getting-started/installing/))
2. Write a post under `courses/content/posts` directory
    - You can follow the [format guide](https://github.com/googlecodelabs/tools). However, since this is not the actual Codelabs, you have to check locally if the features are supported
3. Run `hugo server -D` in `courses` for local test
    - You don't have to kill and run this process whenever you add more contents. You can see the reflected changes if you refresh the browser
4. Commit & Pull Request

#### In case of using GitHub Codespace

1. Skip the first step above since Hugo is preinstalled
2. Run `hugo server -D --baseUrl=/ --appendPort=false` for local test instead

## How to format your post

#### Front matter

```
---
title: TITLE
date: YYYY-MM-DD
categories: [MAIN_CATEGORY, SUB_CATEGORY]
tags: [TAG1, TAG2, ...]
duration: MM:SS
authors: AUTHOR_NAME
---
```

The categories can have two values. The first is the main, and the second is the sub, and they will appear at the bottom of the card in the front page. Only the main category is used to filter by categories and colorize the bottom color of the card. Here is the list of currently supported categories:

- mlops (Machine Learning Operations)
- gcp (Google Cloud Platform)
- tfx (TensorFlow Extended)


#### Contents

Each step should be contained with `{{< step >}}` template string like below. You can give title for each step with the `label` attribute, and the estimated duration can be specified in `duration` attribute as well.

```
{{< step label="Overview" duration="1:00" >}}

WRITE YOUR OWN CONTENT

{{< /step >}}
```

In the `WRITE YOUR OWN CONTENT`, you can simply write anything in Markdown format. If you need to include images, you can put images in `courses/content/assets/images` directory, and don't forget to refer those images with the `/` in the path (i.e. `![IMAGE](/assets/images/YOUR_CODELAB/IMAGE.png)`). You can check out the following source repositories of a few popular Codelabs for reference:

* https://github.com/googlecodelabs/automl-vision-edge-in-mlkit
* https://github.com/googlecodelabs/integrating-ml-apis
* https://github.com/flutter/codelabs/tree/master/firebase-get-to-know-flutter


#### Recommended first few steps

In order to make codelabs as appealing as possible, here are few recommendation: 

- Codelabs are meant to be primarily about **_code_**. So it's recommended to not consider theory-focused 
  posts for Codelabs. 
- Make the **title** more noticible within **no more than 60 characters** long.
- Always **add environmental setup** for readers to reproduce your experiments.
- Keep each steps as compact as possible:
  - Don't try to explain every underlying technologies.
  - Add links to other resources for keeping things compact and interesting to the readers.
- Write multi part codelabs:
  - If you need more detailed explanation on certain topics, simply write more codelabs and leave links. In this way, readers can consume the whole concept/tutorials bite by bite.

There are many wonderful codelabs at [Google Codelabs](https://codelabs.developers.google.com/), so please take a look how they are written. Here are some of them:

- [Using BigQuery with Python](https://codelabs.developers.google.com/codelabs/cloud-bigquery-python)
- [TensorFlow, Keras and deep learning, without a PhD](https://codelabs.developers.google.com/codelabs/cloud-tensorflow-mnist)
- [Train and deploy on-device image classification model with AutoML Vision in ML Kit](https://codelabs.developers.google.com/codelabs/automl-vision-edge-in-mlkit)
