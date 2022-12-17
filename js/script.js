{
  ('use strict');

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
    cloudAuthorSizes: {
      count: 3,
      prefix: 'author-size-',
    },
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

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

  // GENERATE titleList

  const generateTitleLinks = function (customSelector = '') {
    /* remove content of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(
      select.all.articles + customSelector
    );

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
      const linkHTML =
        '<li><a href="#' +
        articleId +
        '"><span>' +
        articleTitle +
        '</span></a></li>';

      /* insert link into titleList */
      /* FIRST BUT WORSE OPTION */
      // titleList.innerHTML = titleList.innerHTML + linkHTML;

      /* SECOND OPTION */
      // titleList.insertAdjacentHTML('beforeend', linkHTML);

      /* LAST OPTION WITH HTML */
      html = html + linkHTML;
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  const calculateTagsParams = function (tags) {
    const params = { max: 0, min: 999999 };

    for (let tag in tags) {
      params.min = Math.min(tags[tag], params.min);
      params.max = Math.max(tags[tag], params.max);
    }

    return params;
  };

  const calculateTagClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(
      percentage * (opts.cloudTagSizes.count - 1) + 1
    );
    return opts.cloudTagSizes.prefix + classNumber;
  };

  /* GENERATE TAG LIST */
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
        const linkTagHTML =
          '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

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
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */

      const tagLinkHTML =
        '<li><a' +
        ' class="' +
        calculateTagClass(allTags[tag], tagsParams) +
        '" ' +
        'href="#tag-' +
        tag +
        '">' +
        tag +
        '</a></li>';

      allTagsHTML += tagLinkHTML;
      /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  };
  generateTags();

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

  const calculateAuthorsParams = function (authors) {
    const params = { max: 0, min: 999999 };

    for (let articleAuthor in authors) {
      params.min = Math.min(authors[articleAuthor], params.min);
      params.max = Math.max(authors[articleAuthor], params.max);
    }

    return params;
  };

  const calculateAuthorClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(
      percentage * (opts.cloudAuthorSizes.count - 1) + 1
    );
    return opts.cloudAuthorSizes.prefix + classNumber;
  };

  /* GENERATE AUTHOR LIST */
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
      const linkAuthorHTML =
        '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';

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
    const authorsParams = calculateAuthorsParams(allAuthors);

    /* [NEW] create variable for all links HTML code */
    let allAuthorsHTML = '';

    /* [NEW] START LOOP: for each aritcleAuthor in allAuthors: */
    for (let articleAuthor in allAuthors) {
      /* [NEW] generate code of a link and add it to allAuthorsHTML */
      const authorLinkHTML =
        '<li><a' +
        ' class="' +
        calculateAuthorClass(allAuthors[articleAuthor], authorsParams) +
        '" ' +
        'href="#author-' +
        articleAuthor +
        '">' +
        articleAuthor +
        '</a></li>';

      allAuthorsHTML += authorLinkHTML;
    }
    /* [NEW] END LOOP: for each articleAuthor in allAuthors: */

    /*[NEW] add HTML from allAuthorsHTML to authorList */
    authorList.innerHTML = allAuthorsHTML;
  };
  generateAuthors();

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
