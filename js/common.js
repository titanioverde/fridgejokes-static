const JokesManager = {
    jokes: null,
    loadJokes: function() {
        return new Promise((resolve, reject) => {
            if (this.jokes) {
                resolve(this.jokes);
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('GET', './json/jokes.json', true);
            
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.jokes = JSON.parse(xhr.responseText);
                        resolve(this.jokes);
                    } else {
                        reject(new Error('Failed to load jokes'));
                    }
                }
            };
            
            xhr.send();
        });
    },
    getRandomJoke: function() {
        const getRandomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];
        
        return this.loadJokes()
            .then(() => getRandomFromArray(this.jokes));
    },
    getJokeById: function(id) {
        return this.loadJokes().then(() => {
            const joke = this.jokes.find(joke => joke.id == id);
            if (!joke) {
                throw new Error('Joke not found');
            }
            return joke;
        });
    }
};

function show_myalert(data) {
    const target = document.querySelector('div#myalert');
    target.innerHTML = data;
    target.style.display = 'block';
}

function move_selection(e) {
    const target = document.querySelector('div#menu_selection_bar');
    const element = this;
    const newTop = element.offsetTop + (parseInt(getComputedStyle(element).marginTop) / 2) + 'px';
    
    animate(target, 'top', newTop, 125);
}

function space_pass(e) {
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('div#main_joke_div')) {
			if (e.code === 'Space') {
				read_joke();
			}
        }
    });
}

function show_hide_player() {
    const player = document.querySelector('div#tune_player');
    player.classList.toggle('tune_player_hide');
    player.classList.toggle('tune_player_show');
}

let calling = null;

function displayJoke(data) {
    const jokeText = document.querySelector('div#main_joke_text p.main_joke');
    jokeText.innerHTML = data.text;
    fadeIn(jokeText, 250);

    const submitterTag = `${data.submitter}`;
    const submitterName = document.querySelector('div#submitter_name');
    submitterName.innerHTML = submitterTag;
    fadeIn(submitterName, 250);

    // Update URL with joke ID
    const url = new URL(window.location);
    url.searchParams.set('joke', data.id);
    history.pushState({}, '', url);
}

function read_joke(jokeId) {
    if (calling && calling.abort) calling.abort();

    fadeOut(document.querySelector('div#main_joke_text p.main_joke'), 250);
    fadeOut(document.querySelector('div#submitter_name'), 250);

    const jokePromise = jokeId ? 
        JokesManager.getJokeById(jokeId) : 
        JokesManager.getRandomJoke();

    jokePromise
        .then(data => {
            setTimeout(() => displayJoke(data), 250);
        })
        .catch(error => {
            show_myalert('Error loading joke: ' + error.message);
        });
}

function fadeOut(element) {
    element.classList.add('fade-transition');
    element.classList.add('fade-out');
}

function fadeIn(element) {
    element.classList.add('fade-transition');
    element.classList.remove('fade-out');
}

function objectToQueryString(obj) {
    return Object.keys(obj)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
}
