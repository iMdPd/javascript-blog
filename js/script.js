{
  ('use strict');

  /* ____________________   HANDLEBARS    ____________________ */
  const templates = {
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    tagLink: Handlebars.compile(
      document.querySelector('#template-tag-link').innerHTML
    ),
    authorLink: Handlebars.compile(
      document.querySelector('#template-author-link').innerHTML
    ),
    tagCloudLink: Handlebars.compile(
      document.querySelector('#template-tag-cloud-link').innerHTML
    ),
    authorCloudLink: Handlebars.compile(
      document.querySelector('#template-author-cloud-link').innerHTML
    ),
  };

  /* ____________________   VARIABLES    ____________________ */
  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
        activeTagLinks: 'a.active[href^="#tag-"]',
        activeAuthors: 'a.active[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
      titles: '.post-title',
    },
    listOf: {
      tags: '.tags.list',
      authors: '.authors.list',
      titles: '.titles',
    },
  };

  const opts = {
    cloudTagSizes: {
      count: 5,
      prefix: 'tag-size-',
    },
  };

  /* ____________________   TITLE CLICK HANDLER FUNCTION   ____________________ */
  const titleClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* find activeLinks using the class selector (active) on links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    /* remove class 'active' from all active links  */
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* find activeArticles using the class selector on articles (active) */
    const activeArticles = document.querySelectorAll('.posts article.active');

    /* remove class 'active' from all articles */
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const clickedArticleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(clickedArticleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  /* ____________________   GENERATE TITLE LIST   ____________________ */
  const generateTitleLinks = function (customSelector = '') {
    /* remove content of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(
      select.all.articles + customSelector
    );

    /* set empty html variable */
    let html = '';

    /* for each article */
    for (let article of articles) {
      /* get the article id  */
      const articleId = article.getAttribute('id');

      /* find the title element */
      const articleTitle = article.querySelector(
        select.article.titles
      ).innerHTML;

      /* create HTML of the link */
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      /* add HTML link to empty html variable */
      html = html + linkHTML;
    }
    /* input HTML links to titleList */
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  /* ____________________   CALCULATE TAGS MIN AND MAX PARAMETERS  ____________________ */
  const calculateTagsParams = function (tags) {
    const params = { max: 0, min: 999999 };

    for (let tag in tags) {
      params.min = Math.min(tags[tag], params.min);
      params.max = Math.max(tags[tag], params.max);
    }

    return params;
  };
  /* ____________________   CALCULATE TAGS SIZE CLASS ____________________ */
  const calculateTagClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(
      percentage * (opts.cloudTagSizes.count - 1) + 1
    );
    return opts.cloudTagSizes.prefix + classNumber;
  };

  /* ____________________   TAG CLICK HANDLER FUNCTION   ____________________ */
  const tagClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll(
      select.all.linksTo.activeTagLinks
    );

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');

      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const equalTagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let equalTagLink of equalTagLinks) {
      /* add class active */
      equalTagLink.classList.add('active');

      /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  /* ____________________   GENERATE TAG LIST  ____________________ */
  const generateTags = function () {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(select.article.tags);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkTagHTMLData = { id: tag, title: tag };
        const linkTagHTML = templates.tagLink(linkTagHTMLData);

        /* add generated code to html variable */
        html = html + linkTagHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;

      /* END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(select.listOf.tags);
    const tagsParams = calculateTagsParams(allTags);

    /* [NEW] create variable for all links HTML code */
    const allTagsData = { tags: [] };

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
      /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  };
  generateTags();

  /* ____________________   TAG CLICK LISTENER FUNCTION   ____________________ */
  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tagsLinks = document.querySelectorAll(select.all.linksTo.tags);
    /* START LOOP: for each link */
    for (let tagLink of tagsLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  };
  addClickListenersToTags();

  /* ____________________   AUTHOR CLICK HANDLER FUNCTION   ____________________ */
  const authorClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');

    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll(
      select.all.linksTo.activeAuthors
    );

    /* START LOOP: for each active author link */
    for (let activeAuthorLink of activeAuthorLinks) {
      /* remove class active */
      activeAuthorLink.classList.remove('active');

      /* END LOOP: for each active author link */
    }

    /* find all author links with "href" attribute equal to the "href" constant */
    const equalAuthorLinks = document.querySelectorAll(
      'a[href="' + href + '"]'
    );

    /* START LOOP: for each found author link */
    for (let equalAuthorLink of equalAuthorLinks) {
      /* add class active */
      equalAuthorLink.classList.add('active');

      /* END LOOP: for each found author link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  /* ____________________   GENERATE AUTHOR LIST  ____________________ */
  const generateAuthors = function () {
    /* [NEW] create a new variable allAuthors with an empty object */
    let allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find author wrapper */
      const authorWrapper = article.querySelector(select.article.author);

      /* make html variable with empty string */
      let html = '';

      /* get author from data-author attribute */
      const articleAuthor = article.getAttribute('data-author');

      /* generate HTML of the link */
      const linkAuthorHTMLData = { id: articleAuthor, title: articleAuthor };
      const linkAuthorHTML = templates.authorLink(linkAuthorHTMLData);

      /* add generated code to html variable */
      html = html + linkAuthorHTML;

      /* [NEW] check if this link is NOT already in allAuthors */
      if (!allAuthors[articleAuthor]) {
        /* [NEW] add articleAuthor to allAuthors object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      /* insert HTML of author into the author wrapper */
      authorWrapper.innerHTML = 'by' + ' ' + html;

      /* END LOOP: for every article: */
    }

    /* [NEW] find list of authors in right column */
    const authorList = document.querySelector(select.listOf.authors);

    /* [NEW] create variable for all links HTML code */
    const allAuthorsData = { authors: [] };

    /* [NEW] START LOOP: for each aritcleAuthor in allAuthors: */
    for (let articleAuthor in allAuthors) {
      /* [NEW] generate code of a link and add it to allAuthorsData */
      allAuthorsData.authors.push({
        author: articleAuthor,
        count: allAuthors[articleAuthor],
      });

      /* [NEW] END LOOP: for each articleAuthor in allAuthors: */
    }
    /*[NEW] add HTML from allAuthorsData to authorList */
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  };
  generateAuthors();

  /* ____________________   AUTHOR CLICK LISTENER FUNCTION   ____________________ */
  const addClickListenersToAuthors = function () {
    /* find all links to authors */
    const authorsLinks = document.querySelectorAll(select.all.linksTo.authors);

    /* START LOOP: for each link */
    for (let authorLink of authorsLinks) {
      /* add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);

      /* END LOOP: for each link */
    }
  };
  addClickListenersToAuthors();
}
