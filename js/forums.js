import { getState, extractQuery, fetchWithTimeout, redirect, showMessage, remainderQuery } from './util.js';

const categories = ['announcements', 'help', 'community'];
const categoryName = ['Announcements', 'Help & Support', 'Community'];

// Forum functionality
function  initForum() {
    const newTopicBtn = EQuery('#new-topic-btn');
    const modal = EQuery('#new-topic-modal');
    const closeModalBtn = modal.find('.close-modal');
    const newTopicForm = EQuery('#new-topic-form');

    clearList();

    const query = extractQuery();
    if (query.category !== undefined) {
        loadCategory(query);
    }

    // Show modal
    newTopicBtn.click(() => modal.show());

    // Close modal
    closeModalBtn.click(() => modal.hide());

    setInterval(async () => await updateForumList(), 30000);

    // Close modal when clicking outside
    EQuery(document.documentElement).click(e => {
        const exceptions = (() => {
            let arr = []
            EQuery('#new-topic-modal *, #new-topic-btn').each((i, elt) => {
                arr.push(elt);
            });
            return arr;
        })();

        if (e.path) {
            let elts = e.path;
            for (let i = 0;i < elts.length;i++) {
                if (exceptions.indexOf(elts[i]) === -1) modal.hide();
                break;
            }
        } else {
            if (exceptions.indexOf(e.target) === -1) modal.hide();
        }
    });

    EQuery('[data-category] h3').click(function () {
        redirect(`?category=${this.parentElement.parentElement.getAttribute('data-category')}`);
    });

    // Handle new topic submission
    newTopicForm.submit(async e => {
        e.preventDefault();
        
        const state = getState();
        const category = EQuery('#topic-category').val();
        const title = EQuery('#topic-title').val();
        const content = EQuery('#topic-category').val();

        if (state == undefined || state.userdata == undefined) {
            showMessage('You need to be logged in to create a topic', 'error');
            return;
        }

        // Clear form and close modal
        newTopicForm[0].reset();
        modal.hide();

        try {
            const requestJSON = {
                'user_id': state.userdata.id,
                'cateory': category,
                'title': title,
                'content': content
            };

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const raw = JSON.stringify(requestJSON);
            const options = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };
            let response = await fetchWithTimeout('https:/surfnetwork-api.onrender.com/submit-forum', options);
        
            if (response.error === undefined) {
                showMessage('Topic created successfully!', 'success');
                updateForumList();
            } else {
                showMessage('Failed to create topic: ' + response.error, 'error');
            }
        } catch (e) {
            showMessage('Failed to create topic: ' + e, 'error');
        }
    });
}

async function loadCategory(query) {
    const cat = categories.indexOf(query.category);
    let itemsCount = query.count || 10;
    let index = Number(query.page) - 1 || 0;
    EQuery('.forum-category').hide();
    EQuery('#topic-category').attr({disabled:true})[0].selectedIndex = cat;

    // if (cat == -1) showError('404', 'Category not found');
    if (query.forum_id !== undefined) { await loadForum(query.forum_id);return }

    const prevBtn = EQuery.elemt('a', '❮');
    const indexCount = EQuery.elemt('a', String(index));
    const nextBtn = EQuery.elemt('a', '❯');
    const header = EQuery.elemt('div', EQuery.elemt('h3', categoryName[cat]), 'forum-category-head');
    const list = EQuery.elemt('div', null, 'forum-body-list topics-list e-row e-margin-bottom e-row-padding');
    const pagination = EQuery.elemt('div', [prevBtn, indexCount, nextBtn], 'pagination');
    const body = EQuery.elemt('div', [list, pagination], 'forum-category-body', {'data-category': query.category});
    const wrapper = EQuery.elemt('div', [header, body], 'forum-category-list');
    EQuery('.forum-categories').append(wrapper);

    let forumPosts = {page: [
        {id: '01', title: 'E', timeString: '1 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '02', title: 'E', timeString: '2 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '03', title: 'E', timeString: '3 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '04', title: 'E', timeString: '4 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '05', title: 'E', timeString: '5 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '06', title: 'E', timeString: '6 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '07', title: 'E', timeString: '7 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '08', title: 'E', timeString: '8 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '09', title: 'E', timeString: '9 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '10', title: 'E', timeString: '10 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '11', title: 'E', timeString: '11 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '12', title: 'E', timeString: '12 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '13', title: 'E', timeString: '13 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '14', title: 'E', timeString: '14 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '15', title: 'E', timeString: '15 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '16', title: 'E', timeString: '16 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '17', title: 'E', timeString: '17 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '18', title: 'E', timeString: '18 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '19', title: 'E', timeString: '19 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '20', title: 'E', timeString: '20 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '21', title: 'E', timeString: '21 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '22', title: 'E', timeString: '22 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '23', title: 'E', timeString: '23 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '24', title: 'E', timeString: '24 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '25', title: 'E', timeString: '25 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '26', title: 'E', timeString: '26 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '27', title: 'E', timeString: '27 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '28', title: 'E', timeString: '28 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '29', title: 'E', timeString: '29 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '30', title: 'E', timeString: '30 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67},
        {id: '31', title: 'E', timeString: '31 days ago', content: 'SDTRYUIJKFGVYUHJLKNBVMFGYUHJMFGNYUKHJ,BFGNYUHJBGYUJHKNBGYUKHJMCFGNYUKJH,YUKHGFNTYUJHEEE', author: 'Proll', replies: 67}
    ]}

    try {
        let response = await fetchWithTimeout(`https://surfnetwork-api.onrender.com/fetch-forum/${query.category}`);
    
        if (response.error === undefined) {
            forumPosts = response;
        } else {
            showMessage('Failed to fetch forum list: ' + response.error, 'error');
            clearList();
        }
    } catch (e) {
        showMessage('Failed to fetch forum list: ' + e, 'error');
        clearList();
    }

    const pages = forumPosts.page;
    const pageCount = pages.length;
    const size = function () {let arr = [];for (let i = 5;i < (pageCount / 2 > 10 ? pageCount / 2 : 10);i++) arr.push(String(i));return arr;}();
    const countSelect = header.select({name: 'count', select: size});
    
    const item = countSelect.panel.find('.e-select-item>div')[itemsCount - 5];
    if (item)
        {item.parentElement.parentElement.children[2].click();item.click();}

    let pagesTemp = function () {let arr = [];pages.forEach(page => arr.push(page));return arr;}();
    let chunk = setChunk(0, pageCount > itemsCount ? itemsCount : pageCount < itemsCount ? pageCount : 1, pagesTemp);

    updateForumList(index, chunk);

    function updateForumList(i, chunk) {
        const max = chunk.length;
        if (pageCount === 0) return;
        let pages = chunk[i];
        list.removeChildren();

        pages.forEach(page => {
            const topic = EQuery.elemt('div', [EQuery.elemt('div', [
                EQuery.elemt('div', [EQuery.elemt('h4', page.title), EQuery.elemt('span', page.timeString, 'tpoic-time')], 'topic-header'),
                EQuery.elemt('div', `${page.content.substring(0, 100)}${page.content.length > 100 ? '...' : ''}`, 'topic-preview'),
                EQuery.elemt('div', [EQuery.elemt('span', `Posted by ${page.author}`, 'topic-author'), EQuery.elemt('span', `${page.replies} ${page.replies === 1 ? 'reply' : 'replies'}`, 'topic-stats')], 'topic-footer')
            ], 'forum-topic')], 'e-col l3 m4 sm6');
            topic.click(() => redirect(`?forum_id=${page.id}&category=${query.category}`));
            list.append(topic)
        });

        indexCount.text(i + 1);
        prevBtn.removeClass('disabled');
        nextBtn.removeClass('disabled');
        if (i === 0) prevBtn.addClass('disabled');
        else if (i === max - 1) nextBtn.addClass('disabled');
    }

    prevBtn.click(function () {
        index -= index !== 0 ? 1 : 0;
        updateForumList(index, chunk);
        window.history.replaceState({}, '', '?page=' + (index + 1) + remainderQuery('page') + window.location.hash);
    });

    nextBtn.click(function () {
        index += index !== chunk.length - 1 ? 1 : 0;
        updateForumList(index, chunk);
        window.history.replaceState({}, '', '?page=' + (index + 1) + remainderQuery('page') + window.location.hash);
    });

    countSelect.panel.find('.e-select-item').click(function () {
        itemsCount = Number(size[countSelect.select[0].selectedIndex]);
        let pagesTemp = function () {let arr = [];pages.forEach(page => arr.push(page));return arr;}();
        chunk = setChunk(0, itemsCount, pagesTemp);
        updateForumList(index, chunk);
        window.history.replaceState({}, '', '?count=' + itemsCount + remainderQuery('count') + window.location.hash);
    });

}

async function loadForum(forum_id) {
    let forumContent;
    const wrapper = EQuery.elemt('div', [header, body], 'forum-category-list');
    EQuery('.forum-categories').append(wrapper);
    try {
        let response = await fetchWithTimeout(`https://surfnetwork-api.onrender.com/fetch-forum/${query.category}/${query.forum_id}`);
    
        if (response.error === undefined) {
            forumContent = response;
        } else {
            showMessage('Failed to fetch forum list: ' + response.error, 'error');
            clearList();
        }
    } catch (e) {
        showMessage('Failed to fetch forum list: ' + e, 'error');
        clearList();
    }

    // TODO: Use forum content to create and append a forum page to the .forum-page element
}

function createTopicElement(id, category, title, content, timeString, author, replies) {
    const topic = EQuery.elemt('div', null, 'forum-topic');
    topic.html(`<div class="topic-header"><h4>${title}</h4><span class="topic-time">${timeString}</span></div><div class="topic-preview">${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</div><div class="topic-footer"><span class="topic-author">Posted by ${author}</span><span class="topic-stats">${replies} ${replies === 1 ? 'reply' : 'replies'}</span></div>`)
    topic.click(() => redirect(`?forum_id=${id}&category=${category}`));

    return topic;
}

async function updateForumList() {
    try {
        let response = await fetchWithTimeout('https://surfnetwork-api.onrender.com/fetch-forum');
    
        if (response.error === undefined) {
            appendForumList(response);
        } else {
            showMessage('Failed to fetch forum list: ' + response.error, 'error');
            clearList();
        }
    } catch (e) {
        showMessage('Failed to fetch forum list: ' + e, 'error');
        clearList();
    }
}

function appendForumList(response, index = 3) {
    const forums = {
        announcements: setChunk(0, index, response.announcements)[0],
        help: setChunk(0, index, response.help)[0],
        community: setChunk(0, index, response.community)[0]
    }

    for (let category in forums) {
        forums[category].forEach(q => {
            const categoryList = EQuery(`.forum-category[data-category="${category}"] .topics-list`);
            categoryList.prepend(createTopicElement(q.id, category, q.topic, q.content, q.time, q.author, q.replies));
        });
    }
}

function clearList() {
    for (let i = 0, list = ['announcements', 'help', 'community'];i < list.length;i++) {
        EQuery(`.forum-category[data-category="${list[i]}"] .topics-list`).html(`<div class="topic-preview e-opacity">Be the first to create a topic</div>`);
    }
}

function setChunk(start, count, items) {
    let arr = [];
    
    while (items.length > count) {
        arr.push([...items.splice(start, count)]);
    }

    arr.push([...items]);
    
    return arr;
}

export {updateForumList, initForum}