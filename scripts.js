function searchUser(){
    uri = "https://api.github.com/users/" + document.getElementById("inputUsername").value;
    makeRequest('GET', uri)
        .then(function (user) {
            var responseObj = JSON.parse(user);
            document.getElementById('error').style.display = "none";
            document.getElementById("result").style.display = "block";
            document.getElementById("img").src=responseObj.avatar_url;
            document.getElementById("username").innerHTML = "@" + responseObj.login;
            if(responseObj.name!=null) document.getElementById("fullname").innerHTML = responseObj.name; else document.getElementById("fullname").innerHTML = "placeholder name";
            if(responseObj.bio!=null) document.getElementById("bio").innerHTML = responseObj.bio; else document.getElementById("bio").innerHTML = "placeholder bio";
            return makeRequest('GET',responseObj.repos_url);

        })
        .then(function (userRepos) {
            var responseObj2 = JSON.parse(userRepos);
            var div = document.getElementById("reposList");
            var ul2 = document.getElementById("posList");
            if(ul2) ul2.remove();
            var ul = document.createElement('ul');
            ul.setAttribute('id','posList');
            div.appendChild(ul);
            responseObj2.forEach(renderReposList);

            function renderReposList(element, index, arr) {
                var li = document.createElement('li');
                li.setAttribute('class','item');
                li.setAttribute('style','list-style-type:none');
                li.setAttribute('onclick',"location.href='" + element.html_url + "'");
                ul.appendChild(li);
                var stats = document.createElement('div');
                stats.setAttribute('id','stats');

                var aStar = document.createElement('a');
                aStar.setAttribute('href',element.html_url + "/stargazers");
                var starSvg = document.createElement('svg');
                starSvg.setAttribute('height','16');
                starSvg.setAttribute('width','14');
                var starPath = document.createElement('path');
                starPath.setAttribute('d','M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z');
                starSvg.appendChild(starPath);
                aStar.appendChild(starSvg);
                aStar.innerHTML = aStar.innerHTML + element.stargazers_count;
                stats.appendChild(aStar);

                var aFork = document.createElement('a');
                aFork.setAttribute('href',element.html_url + "/network");
                var forkSvg = document.createElement('svg');
                forkSvg.setAttribute('height','16');
                forkSvg.setAttribute('width','10');
                forkSvg.setAttribute('viewBox','0 0 10 16');
                var forkPath = document.createElement('path');
                forkPath.setAttribute('d','M8 1c-1.11 0-2 0.89-2 2 0 0.73 0.41 1.38 1 1.72v1.28L5 8 3 6v-1.28c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v1.78l3 3v1.78c-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V9.5l3-3V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2zM2 4.2c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3 10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3-10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z"');
                forkSvg.appendChild(forkPath);
                aFork.appendChild(forkSvg);
                aFork.innerHTML = aFork.innerHTML + element.forks;
                stats.appendChild(aFork);

                li.appendChild(stats);
                li.innerHTML=li.innerHTML + element.name.substring(0,20);
            }
        })
        .catch(function (err) {
            console.error('There was an error!', err.statusText);
            document.getElementById("result").style.display = "none";
            var div = document.getElementById('error');
            div.innerHTML="";
            div.style.display = "block";
            div.innerHTML = "Does not exist";
            div.appendChild(errorDiv);
        });
}

function makeRequest (method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

