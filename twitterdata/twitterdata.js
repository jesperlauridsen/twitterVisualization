var globalData;
var dataInjected = 0;

function initalStartUp() {
    var myParam = location.search.split('dataset=')[1];
    console.log(myParam);
    if(myParam === undefined) {
        var startScreen = document.createElement('div');
        startScreen.id = "startScreen";
        startScreen.className = "startScreenClass";
        document.body.appendChild(startScreen);
        generateMenu("startScreen");
        var introduction = document.createElement('div');
        introduction.id = "introduction";
        introduction.className = "introductionClass";
        document.body.appendChild(introduction);
        document.getElementById("introduction").innerHTML += "<p>Choose a dataset to see visualized from the menu.</p><p>The overall stats for the hashtag in the given period <br> will be shown first, and afterwards it's possible to dive <br> deeper into each of the contributors in the period <br> of the dataset in the column called 'Most contributions'.</p>"
    }
    else if(myParam === "aarhusuni") {
        loadTwitterData('hashtagaarhusuni.csv','#aarhusuni');
    }
    else if(myParam === "ultratwitteragf") {
        loadTwitterData('try2.csv','#ultratwitteragf');
    }
    else if(myParam === "aarhus") {
        loadTwitterData('hashtagaarhus.csv','#aarhus');
    }
    else if(myParam === "dst4l") {
        loadTwitterData('finaltweeterdata-sorted2.csv','#DST4L');
    }
    else {
        loadTwitterData('finaltweeterdata-sorted2.csv','#DST4L');
    }
}

function loadTwitterData(url,hashtag) {
    var dataset = hashtag.slice(1)
    window.history.replaceState( {} , '', '?dataset=' + dataset);
    loadscreen();
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET",url,true);
    //rawFile.open("GET", "finaltweeterdata-sorted2.csv", true);
    //rawFile.open("GET", "try2.csv", true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var arrayOfDataObjects = [];
                //console.log(allText);
                var lineArr = allText.split('\n');
                for(y=1;y<lineArr.length-1;y++) {
                    var singleTweetArray = lineArr[y].split(";");
                    var realTime = singleTweetArray[7] * 1000;
                    var tweetTime = new Date(realTime);
                    var object = {
                        tweeter:singleTweetArray[2],
                        link:singleTweetArray[1],
                        handle:singleTweetArray[3],
                        tweet:singleTweetArray[4],
                        datatime:singleTweetArray[7],
                        realtime:tweetTime,
                        likes:Number(singleTweetArray[5]),
                        retweets:Number(singleTweetArray[6]),
                    };
                    if(y===1) {
                        //console.log(object.realtime + " " + object.tweet);
                    }
                   arrayOfDataObjects.push(object);
                }
                globalData = arrayOfDataObjects;
                //console.log(globalData);
                dataInjected = 1;
                document.body.innerHTML = "";
                loadBackgroundImage();
                showFirstTwitterData(hashtag);
            }
        }
    }
    rawFile.send(null);
}

function loadBackgroundImage() {
    var backgroundImage = document.createElement('div');
    backgroundImage.id = "backgroundImage";
    document.body.appendChild(backgroundImage);
}

function showFirstTwitterData(hashtag) {
    sanatizeData(globalData);
    generateSetup();
    generateOverallDatasetStatistics(globalData,hashtag);
    //introductonToStatistics(globalData,"DST4L");
    creatingTweetOverview(globalData);
    showEntireEventTweetProgress(globalData);
    personWithHighestTweets(globalData,"field");
    showMostLiked(globalData,"field2");
    showMostRetweeted(globalData,"field3");
    //sortDatasetAfterDate(globalData);
    //personalOutwardRelations(globalData,"@knanton");
    //plotDataForAllDaysIn24HourInterval(globalData);
    generateFooter();
}

function loadscreen() {
        if(document.getElementById("loadingScreenOverall") === null) {
        var loadingScreen = document.createElement('div');
        loadingScreen.id = "loadingScreenOverall";
        loadingScreen.className = "loadingScreenClass";
        document.body.appendChild(loadingScreen);

        var loading = document.createElement('div');
        loading.id = "loading";
        loading.className = "loadingClass";
        document.getElementById("loadingScreenOverall").appendChild(loading);
        document.getElementById("loading").inneHTML = "Loading";

        var rotatingLoadingScreen = document.createElement('div');
        rotatingLoadingScreen.id = "rotatingLoadingScreen";
        rotatingLoadingScreen.className = "rotatingLoadingScreenClass";
        document.getElementById("loading").appendChild(rotatingLoadingScreen);
        }
        else {
            document.getElementById("loadingScreenOverall").style.display = "block";
            //console.log("LOADING DAMNIT!");
        }
}

function reshowFirstTwitterData() {
    showEntireEventTweetProgress(globalData);
    document.getElementById("field").innerHTML = "";
    personWithHighestTweets(globalData,"field");
    document.getElementById("field2").innerHTML = "";
    showMostLiked(globalData,"field2");
    document.getElementById("field3").innerHTML = "";
    showMostRetweeted(globalData,"field3");
}

function sortDatasetAfterDate(dataset,argument) {
    var timeSortedDataset = dataset;
    timeSortedDataset.sort(function(a, b) {return parseFloat(a.realtime.getTime()) - parseFloat(b.realtime.getTime());});
    if(argument === 0) {
        return timeSortedDataset[0];
    }
    else if(argument === 1) {
        return timeSortedDataset[timeSortedDataset.length-1];
    }
    else {
        return "0";
    }
}

function generateSetup() {
    var introContainer = document.createElement('div');
    introContainer.id = "introContainer";
    introContainer.className = "introContainer";
    document.body.appendChild(introContainer);

    var intro = document.createElement('div');
    intro.id = "intro";
    //intro.style.float = "left";
    document.getElementById("introContainer").appendChild(intro);
    //canvas.style.border = "1px solid";

    var identifier = document.createElement('div');
    identifier.id = "canvasContainer";
    document.getElementById("introContainer").appendChild(identifier);

    var canvasHeadline = document.createElement('h3');
    canvasHeadline.id = "canvasHeadline";
    //canvasHeadline.style.height = "50px";
    document.getElementById("canvasContainer").appendChild(canvasHeadline);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.id = "canvas";
    canvas.width = window.innerWidth;
    canvas.height = 320;
    canvas.style.zIndex = 8;
    //canvas.style.border = "1px solid";
    document.getElementById("canvasContainer").appendChild(canvas);
}

function generateFooter() {
    var footer = document.createElement('footer');
    footer.id = "jsprFooter";
    footer.className = "jsprFooterStyled";
    document.body.appendChild(footer);
    document.getElementById("jsprFooter").innerHTML = "by <a href='https://www.twitter.com/justjspr'>jspr</a>, code at <a href='https://github.com/jesperlauridsen/twiviz'>github</a>";
}

function generateOverallDatasetStatistics(dataset,hashtag) {
    var allNumbers = [{name:"day span in the dataset",number:""},{name:"tweets in the dataset",number:""},{name:"authors contributed",number:""},{name:"hashtag for dataset",number:hashtag},{name:"tweets per day",number:""},{name:"average likes per tweet",number:""},{name:"average retweets per tweet",number:""},{name:"average number of tweets per author",number:""},];


    var endDate = sortDatasetAfterDate(dataset,1);
    var startDate = sortDatasetAfterDate(dataset,0);
    var calDate = new Date(startDate.realtime.getTime());
    var calEndDate = new Date(endDate.realtime.getTime());
    var startDateToText = new Date();
    startDateToText.setTime(startDate.realtime.getTime());
    var daysBetween = 0;
    for(u=0;u<1;) {
        if(calDate.getTime() <= calEndDate.getTime()) {
            daysBetween = daysBetween + 1;
        }
        else {
            u = 1;
        }
        calDate.setDate(calDate.getDate() + 1);
    }
    var entireDaysEvent = daysBetween;
    allNumbers[0].number = entireDaysEvent;
    var numberOfTweets = dataset.length;
    allNumbers[1].number = numberOfTweets;
    var numberOfAuthors = findAllAuthors(dataset);
    allNumbers[2].number = numberOfAuthors;
    var averageTweetsPerDay = numberOfTweets/entireDaysEvent.toFixed(2);
    allNumbers[4].number = averageTweetsPerDay.toFixed(2);
    var likes = 0;
    for(o=0;o<globalData.length;o++) {
        likes = likes + globalData[o].likes;
    }
    var retweets = 0;
    for(n=0;n<globalData.length;n++) {
        retweets = retweets + globalData[n].retweets;
    }
    var averageLikesPerTweet = likes/numberOfTweets.toFixed(2);
    allNumbers[5].number = averageLikesPerTweet.toFixed(2);
    var averageRetweetsPerTweet = retweets/numberOfTweets.toFixed(2);
    allNumbers[6].number = averageRetweetsPerTweet.toFixed(2);
    //console.log(allNumbers);
    var averageTweetsPerAuthor = numberOfTweets/numberOfAuthors;
    allNumbers[7].number = averageTweetsPerAuthor.toFixed(2);

    var generalStatistics = document.createElement('h3');
    generalStatistics.id = "generalStatisticsHeadlineContainer";
    generalStatistics.className = "generalStatisticsHeadlineContainerClass";
    document.getElementById("intro").appendChild(generalStatistics);
    document.getElementById("generalStatisticsHeadlineContainer").innerHTML = "General statistics for dataset";

    generateMenu("intro");

    for(y=0;y<8;y++) {
        var generalStatistics = document.createElement('div');
        generalStatistics.id = "generalStatisticsContainer" + y;
        generalStatistics.className = "generalStatisticsClass";
        document.getElementById("intro").appendChild(generalStatistics);
        var mainNumber = document.createElement("p");
        mainNumber.id = "mainNumberNode" + y;
        mainNumber.className = "mainNumberClass";
		var mainNumberNode = document.createTextNode(allNumbers[y].number);
		mainNumber.appendChild(mainNumberNode);
        document.getElementById("generalStatisticsContainer"+y).appendChild(mainNumber);
        var explanationP = document.createElement("p");
        explanationP.id = "explanationP" + y;
        explanationP.className = "explanationPClass";
		var explanationNode = document.createTextNode(allNumbers[y].name);
		explanationP.appendChild(explanationNode);
        document.getElementById("generalStatisticsContainer"+y).appendChild(explanationP);
    }
}

function generateMenu(div) {
    var generalStatisticsMenuContainer = document.createElement('div');
    generalStatisticsMenuContainer.id = "generalStatisticsMenuContainer";
    generalStatisticsMenuContainer.className = "generalStatisticsMenuContainerClass";
    document.getElementById(div).appendChild(generalStatisticsMenuContainer);
    document.getElementById("generalStatisticsMenuContainer").innerHTML = "dataset <br><br><ul style='text-align:left;'><li id='option1'>#DST4L</li><li id='option2'>#ultratwitteragf</li><li id='option3'>#aarhus</li><li id='option4'>#aarhusuni</li></ul>";
    document.getElementById("option1").onclick=function(){loadTwitterData('finaltweeterdata-sorted2.csv','#DST4L');};
    document.getElementById("option2").onclick=function(){loadTwitterData('try2.csv','#ultratwitteragf');};
    document.getElementById("option3").onclick=function(){loadTwitterData('hashtagaarhus.csv','#aarhus');};
    document.getElementById("option4").onclick=function(){loadTwitterData('hashtagaarhusuni.csv','#aarhusuni');};
}

function plotDataForAllDaysIn24HourInterval(dataset) {
    document.getElementById("canvasHeadline").innerHTML = "All tweets in the period in a 24 hour grid";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var seperateNumber;
    var arrayOfDividers = [];
    for(y=1;y<=24;y++) {
        seperateNumber = document.getElementById("canvas").width/25 * y;
        arrayOfDividers.push(seperateNumber);
    }
    //console.log(arrayOfDividers);
    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(5,280);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5,280);
    ctx.lineTo(canvas.width-5,280);
    ctx.stroke()
    for(i=0;i<arrayOfDividers.length;i++) {
        ctx.beginPath();
        ctx.moveTo(arrayOfDividers[i],275);
        ctx.lineTo(arrayOfDividers[i],285);
        ctx.stroke();
        //ctx.font = "30px Arial";
        var textNumber = "";
        if(i < 10) {
            textNumber = Number(i) + Number(1);
            textNumber = "0" + i;
        }
        else {
            textNumber = i + 1;
        }
        ctx.fillText(textNumber,arrayOfDividers[i]-5,295);
    }
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var days = [];
    var hours = [];
    var existing = 0;
    //console.log("yay" + globalData);
    for(n=0;n<dataset.length;n++) {
        existing = 0;
        for(y=0;y<days.length;y++) {
            if(dataset[n].realtime.getDate() === days[y][0].realtime.getDate() && dataset[n].realtime.getMonth() === days[y][0].realtime.getMonth() && dataset[n].realtime.getFullYear() === days[y][0].realtime.getFullYear()) {
                existing = 1;
                days[y].push(dataset[n])
            }
        }
        if(existing === 0) {
            days[days.length] = new Array();
            days[days.length-1].push(dataset[n]);
        }
    }
    //console.log(days);
    for(u=0;u<days.length;u++) {
        hours[hours.length] = new Array();
        for(h=0;h<24;h++) {
        var value = 0;
        hours[hours.length-1].push(value);
    }
        for(i=0;i<days[u].length;i++) {
            var newValue = hours[hours.length-1][days[u][i].realtime.getHours()] + 1;
            hours[hours.length-1][days[u][i].realtime.getHours()] = newValue;
            //console.log(days[u][i].realtime.getHours());
            }
        }

    var highestHour = 0;
    for(n=0;n<hours.length;n++) {
        for(k=0;k<hours[n].length;k++) {
            if(hours[n][k] >= highestHour) {
                highestHour = hours[n][k];
            }
        }
    }
    hours.reverse();
    days.reverse();
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(10,5)
    ctx.stroke();
    ctx.fillText(highestHour,10,9)

    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(5,137.5);
    ctx.lineTo(10,137.5);
    ctx.stroke();
    ctx.fillText(Math.floor(highestHour/2),10,141.5)

    for(o=0;o<days.length;o++) {
        //console.log(days[o][0].realtime.getDate());
        //ctx.fillText(days[o][0].realtime.getDate() + "/" + days[o][0].realtime.getMonth() + "-" +days[o][0].realtime.getFullYear(),canvas.width-150,10 +(o*10));
    }
    var arrayOfDividers = [];
    for(y=1;y<=24;y++) {
        seperateNumber = canvas.width/25 * y;
        arrayOfDividers.push(seperateNumber);
    }
    for(n=0;n<hours.length;n++) {
        ctx.font = "16px Arial";
        ctx.fillText(days[n][0].realtime.getDate() + "/" + days[n][0].realtime.getMonth() + "-" +days[n][0].realtime.getFullYear() + " (" + days[n].length + " tweets)" ,canvas.width-185,20 +(n*20));
        for(k=0;k<hours[n].length;k++) {
            var heightZ;
            if(hours[n][k] === 0) {
                heightZ = 280;
            }
            else {
                heightZ = 280 - ((hours[n][k] / highestHour) * 275);
            }
            var hour = k + 1;
            //console.log("day: " + n + " hour: " + hour + " number of tweets: " + hours[n][k] + " height: " + heightZ);
            ctx.beginPath();
            //console.log(arrayOfDividers[k] + " " + heightZ + " " + hours[n][k]);
            ctx.arc(arrayOfDividers[k],heightZ,2,0,2*Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
            //console.log("painting?");
        }
    }
    for(n=0;n<hours.length;n++) {
        for(k=0;k<hours[n].length;k++) {
            var HZ;
            var HX;
            if(hours[n][k] === 0) {
                HZ = 280;
            }
            else {
                HZ = 280 - ((hours[n][k] / highestHour) * 275);
            }
            if(hours[n][k+1] === 0) {
                HX = 280;
            }
            else {
                HX = 280 - ((hours[n][k+1] / highestHour) * 275);
            }
            ctx.beginPath();
            ctx.moveTo(arrayOfDividers[k],HZ);
            ctx.lineTo(arrayOfDividers[k+1],HX);
            ctx.stroke();
        }
    }
    //console.log(days);
}

function showEntireEventTweetProgress(dataset,person) {
    removePersonalStatistics();
    // -- Set up the info for the canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(person != undefined) {
        document.getElementById("canvasHeadline").innerHTML = "All tweets in the dataset from " + person + " over the entire period of time";
    }
    else {
        document.getElementById("canvasHeadline").innerHTML = "All tweets in the dataset over the entire period of time";
    }
    sortedDataset = globalData.sort(function(a, b) {return parseFloat(a.realtime.getTime()) - parseFloat(b.realtime.getTime());});
    var endDate = sortDatasetAfterDate(dataset,1);
    var startDate = sortDatasetAfterDate(dataset,0);
    var calDate = new Date(startDate.realtime.getTime());
    var calEndDate = new Date(endDate.realtime.getTime());
    var startDateToText = new Date();
    startDateToText.setTime(startDate.realtime.getTime());
    var endDateToText = new Date();
    endDateToText.setTime(endDate.realtime.getTime());
    var daysBetween = 0;
    for(u=0;u<1;) {
        if(calDate.getTime() <= calEndDate.getTime()) {
            daysBetween = daysBetween + 1;
        }
        else {
            u = 1;
        }
        calDate.setDate(calDate.getDate() + 1);
    }
    var diffDays = daysBetween;
    var difference = (canvas.width-10)/diffDays;
    var singlePoint = ((canvas.width-10))/((24*diffDays)-1);
    ctx.fillStyle="white";
    ctx.strokeStyle="white";
    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(5,280);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5,280);
    ctx.lineTo(canvas.width-5,280);
    ctx.stroke();

    // -- Write dates on canvas to give a sense of time on timeline
    ctx.font="10px Trebuchet MS";
    if(daysBetween < 31) {
        for(y=0;y<diffDays;y++) {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(Math.floor(y*difference)+5,280);
        ctx.lineTo(Math.floor(y*difference)+5,285);
        ctx.stroke();
        ctx.font="10px Trebuchet MS";
        var monthToDisplay = startDateToText.getMonth() + 1;
        ctx.fillText(startDateToText.getDate() + "/" + monthToDisplay,y*difference,295);
        startDateToText.setDate(startDateToText.getDate()+1);
        }
    }
    else {
        for(y=0;y<diffDays;y++) {
            if(y % Math.round(diffDays/30) === 0) {
                ctx.strokeStyle = "white";
                ctx.beginPath();
                ctx.moveTo(Math.floor(y*difference)+5,280);
                ctx.lineTo(Math.floor(y*difference)+5,285);
                ctx.stroke();
                ctx.font="10px Trebuchet MS";
                var monthToDisplay = startDateToText.getMonth() + 1;
                ctx.fillText(startDateToText.getDate() + "/" + monthToDisplay,y*difference,295);
            }
            var monthToDisplay = startDateToText.getMonth() + 1;
            startDateToText.setDate(startDateToText.getDate()+1);
        }

    }
    var arrayOfDays = [];
    var countingDate = new Date(startDate.realtime.getTime());
    var arrayEndDate = new Date(endDate.realtime.getFullYear(),endDate.realtime.getMonth(),endDate.realtime.getDate(),"23","59");
    counter = 0;
    // -- Create timeline objects
    for(j=0;j<1;j) {
        if(countingDate.getTime() < arrayEndDate.getTime()) {
            var specificDate = countingDate;
            var specificMonth = specificDate.getMonth()+1;
            var day = {
                hour0:0,
                hour1:0,
                hour2:0,
                hour3:0,
                hour4:0,
                hour5:0,
                hour6:0,
                hour7:0,
                hour8:0,
                hour9:0,
                hour10:0,
                hour11:0,
                hour12:0,
                hour13:0,
                hour14:0,
                hour15:0,
                hour16:0,
                hour17:0,
                hour18:0,
                hour19:0,
                hour20:0,
                hour21:0,
                hour22:0,
                hour23:0,
                tDate:specificDate.getDate() + "/" + specificMonth + "-" + specificDate.getFullYear(),
                tCanvasPoint:0,
            }
            arrayOfDays.push(day);
            countingDate.setDate(countingDate.getDate()+1);
            counter = counter + 1;
        }
        else {
            j = 1;
        }
    }
    // -- plot in data from the dataset to the timeline objects
    if(person === undefined) {
        for(h=0;h<dataset.length;h++) {
            var number = "hour" + dataset[h].realtime.getHours();
            arrayOfDays[daysBetweenFunction(startDate.realtime, dataset[h].realtime)][number] = arrayOfDays[daysBetweenFunction(startDate.realtime, dataset[h].realtime)][number] + 1;
        }
    }
    else {
        for(h=0;h<dataset.length;h++) {
            if(person === dataset[h].handle) {
                var number = "hour" + dataset[h].realtime.getHours();
                arrayOfDays[daysBetweenFunction(startDate.realtime, dataset[h].realtime)][number] = arrayOfDays[daysBetweenFunction(startDate.realtime, dataset[h].realtime)][number] + 1;
                }
        }
    }
    // -- Find the highest point
    var highNumb = 0;
    var totalNumberOfEntries = 0;
    for(j=0;j<Object.keys(arrayOfDays).length;j++) {
        for(h=0;h<Object.keys(arrayOfDays[j]).length-2;h++) {
             var totalNumberOfEntries = totalNumberOfEntries + 1;
            if(arrayOfDays[j][Object.keys(arrayOfDays[j])[h]] > highNumb) {
                highNumb = arrayOfDays[j][Object.keys(arrayOfDays[j])[h]];
            }
        }
    }
    ctx.strokeStyle = "#000000";

    // -- Write lines to explain dimensions in the canvas
    for(y=0;y<4;y++) {
        var number = [1,1.3333333,2,4];
        if(Math.floor(highNumb/number[y]) != 0) {
            ctx.strokeStyle ="rgba(127,127,127, 0.3)";
            ctx.beginPath();
            ctx.moveTo(5,(280-((280-5)/number[y])));
            ctx.lineTo(document.getElementById("canvas").width,(280-((280-5)/number[y])));
            ctx.stroke();
            ctx.strokeStyle = "#000000";
            ctx.fillText((highNumb/number[y]).toFixed(2),10,(280-((280-5)/number[y]))+5);
            }
        }
    // -- plot in the entire graph
    var counterForColor = 0;
    //console.log(arrayOfDays);
    for(l=0;l<Object.keys(arrayOfDays).length;l++) {
         for(x=0;x<Object.keys(arrayOfDays[l]).length-2;x++) {
            var draw = 1;
            var HZ;
            var HX;
            if(arrayOfDays[l][Object.keys(arrayOfDays[l])[x]] === 0) {
                HZ = 280;
            }
            else {
                HZ = 280 - ((arrayOfDays[l][Object.keys(arrayOfDays[l])[x]] / highNumb) * 275);
            }
            if(arrayOfDays[l][Object.keys(arrayOfDays[l])[x+1]] === 0) {
                HX = 280;
            }
            else if(x === 23) {
                try {
                HX = 280 - ((arrayOfDays[l+1][Object.keys(arrayOfDays[l+1])[0]] / highNumb) * 275);
                }
                catch(err) {
                   draw = 0;
                }
            }
            else {
                HX = 280 - ((arrayOfDays[l][Object.keys(arrayOfDays[l])[x+1]] / highNumb) * 275);
            }
            if(draw === 1) {
            var color1 = Math.round((255/totalNumberOfEntries)*counterForColor);
            var color2 = Math.round(255 - ((255/totalNumberOfEntries)*counterForColor));
            var color = "rgba(" + color1 + ", 127, " + color2 + " , 1)";
            ctx.strokeStyle = color;
            ctx.beginPath();
            //console.log(l + "  " + x + " x: " + 5+(singlePoint*(counterForColor)) + " y: " + HZ + " HZ");
            //console.log(l + "  " + x + " x: " + 5+(singlePoint*(counterForColor+1)) + " y: " + HX);
            ctx.moveTo(5+(singlePoint*(counterForColor)),HZ);
            ctx.lineTo(5+(singlePoint*(counterForColor+1)),HX);
            ctx.stroke();
            var colorForArc = "rgba(" + color1 + ", 127, " + color2 + " , 0.4)";
            ctx.strokeStyle = colorForArc;
            ctx.fillStyle = colorForArc;
            ctx.beginPath();
            if(HX != 280) {
                ctx.arc(5+(singlePoint*(counterForColor+1)),HX,2,0,2*Math.PI);
            }
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
            }
             counterForColor = counterForColor + 1;
        }
    }
    //console.log(counterForColor);
    //console.log(arrayOfDays);
    if(person != undefined) {
        mostPersonalLikedTweets(globalData,person,"field2");
        mostPersonalRetweetedTweets(globalData,person,"field3");
        createFinalPersonalVisualization(person);
        personalOutwardRelations(dataset,person);
    }
    canvas.addEventListener('mouseout', function(evt) {
        try {
            document.getElementById("displayOfData").style.display = "none";
        }
        catch(err) {

        }
    });

    canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        var counter = ((document.getElementById("canvasContainer").clientWidth-10)/(diffDays*24));
        var finalC = Math.floor((x)/(document.getElementById("canvasContainer").clientWidth-10)*(diffDays*24));
        var ffs = parseInt((finalC * counter))+parseInt(5);
        //console.log(finalC + " " + counter + " " + ffs);
        if(document.getElementById("displayOfData") === null) {
             var displayOfData = document.createElement('div');
             displayOfData.id = "displayOfData";
             displayOfData.className = "displayOfDataClass";
             document.getElementById("canvasHeadline").parentNode.appendChild(displayOfData);
             document.getElementById("displayOfData").style.left = ffs - 35;
             document.getElementById("displayOfData").style.bottom = -y-105; //document.getElementById("intro").clientHeight + document.getElementById("canvasHeadline").clientHeight - (y+25);
        }
        else {
             document.getElementById("displayOfData").style.left = ffs - 35;
             document.getElementById("displayOfData").style.bottom = -y-105; //document.getElementById("intro").clientHeight + document.getElementById("canvasHeadline").clientHeight - (y+25);
        }
        if(document.getElementById("displayOfData").style.display === "none") {
            document.getElementById("displayOfData").style.display = "block";
        }
        var figureOut = finalC;
        var figureOutHours = 0;
        var figureOutDays = 0;
        for (o = 0; o < 1;) {
            if (figureOut < diffDays*24) {
                if (figureOut > 23) {
                    figureOutDays = figureOutDays + 1;
                    figureOut = figureOut - 24;
                } else {
                    o = 1;
                    figureOutHours = figureOut;
                }
            }
            else {
                o = 1;
            }
        }
        afterHour = figureOutHours+1;
        //console.log(figureOut + " - " + figureOutDays + ":" + figureOutHours);
        document.getElementById("displayOfData").innerHTML = arrayOfDays[figureOutDays].tDate.split("-").shift() + "<br>" + figureOutHours + ":00-" + afterHour + ":00<br>Tweets: " + arrayOfDays[figureOutDays][Object.keys(arrayOfDays[figureOutDays])[figureOutHours]];
    });
}

function daysBetweenFunction(startDate, endDate) {
    var time = endDate.getTime() - startDate.getTime();
    days = Math.floor(time/(24 * 60 * 60 * 1000));
    return days;
    //console.log(days + " days between " + startDate + " and " + endDate);
}

function creatingTweetOverview(dataset) {
    var personalVisualization = document.createElement('div');
    personalVisualization.id = "personalVisualization";
    personalVisualization.className = "personalVisualizationContainer";
    document.body.appendChild(personalVisualization);

    var overallContainerForLists = document.createElement('div');
    overallContainerForLists.id = "overallContainerForLists";
    overallContainerForLists.className = "overallContainerForLists";
    document.body.appendChild(overallContainerForLists);

    var headlineContainer = document.createElement('div');
    headlineContainer.id = "headlineContainer";
    headlineContainer.className = "headlineContainer";
    document.getElementById("overallContainerForLists").appendChild(headlineContainer);

    var headline = document.createElement('div');
    headline.id = "headline1";
    headline.className = "headline";
    document.getElementById("headlineContainer").appendChild(headline);
    document.getElementById("headline1").innerHTML = "<h3>Most contributions </h3><p class='seeMoreFromContributors'>- click to see individual statistics</p>";

    var headline1 = document.createElement('div');
    headline1.id = "headline2";
    headline1.className = "headline";
    document.getElementById("headlineContainer").appendChild(headline1);
    document.getElementById("headline2").innerHTML = "<h3>Most liked tweets</h3>";

    var headline2 = document.createElement('div');
    headline2.id = "headline3";
    headline2.className = "headline";
    document.getElementById("headlineContainer").appendChild(headline2);
    document.getElementById("headline3").innerHTML = "<h3>Most retweeted tweets</h3>";

    var field = document.createElement('div');
    field.id = "field";
    var length = ((window.innerWidth/3)*1)-10;
    field.style.width  = length + "px";
    field.style.height = "100px";
    field.style.float = "left";
    field.style.marginTop = "50px";
    field.className = "listContainer";
    document.getElementById("overallContainerForLists").appendChild(field);

    var field2 = document.createElement('div');
    field2.id = "field2";
    var length = ((window.innerWidth/3)*1)-10;
    field2.style.width  = length + "px";
    field2.style.height = "100px";
    field2.style.float = "left";
    field2.style.marginTop = "50px";
    field2.className = "listContainer";
    document.getElementById("overallContainerForLists").appendChild(field2);

    var field3 = document.createElement('div');
    field3.id = "field3";
    var length = ((window.innerWidth/3)*1)-10;
    field3.style.width  = length + "px";
    field3.style.height = "100px";
    field3.style.float = "left";
    field3.style.marginTop = "50px";
    field3.className = "listContainer";
    document.getElementById("overallContainerForLists").appendChild(field3);
}

function createFinalPersonalVisualization(person) {
    //var personalVisualization = document.createElement('div');
    //personalVisualization.id = "personalVisualization";
    //personalVisualization.className = "personalVisualizationContainer";
    //document.body.appendChild(personalVisualization);
    //document.getElementsByClassName("introContainer")[0].parentNode.appendChild(personalVisualization);
    //document.getElementsByClassName("overallContainerForLists")[0].insertBefore(personalVisualization, document.getElementsByClassName("overallContainerForLists")[0].children[0]);

    var personalVisHeader = document.createElement('div');
    personalVisHeader.id = "personalVisHeader";
    personalVisHeader.className = "personalVisHeaderContainer";
    document.getElementById("personalVisualization").appendChild(personalVisHeader);
    document.getElementById("personalVisHeader").innerHTML = "<h3>Personal statistics for " + person + "</h3><p id='resetStatistics' onClick='reshowFirstTwitterData();removePersonalStatistics();'>- reset</p>";

    createEntirePersonalRelationsFrame("personalVisualization",person);
}

//Display the overall layout of the tweeter-dataset.
function introductonToStatistics(dataset,argument) {
    if(dataInjected === 0) {
       loadTwitterData();
    }
    generateSetup();
    //console.log(globalData);
    sortedDataset = dataset.sort(function(a, b) {return parseFloat(a.datatime) - parseFloat(b.datatime);});
    var endDate = sortedDataset[sortedDataset.length-1].realtime;
    var startDate = sortedDataset[0].realtime;
    var oneDay = 24*60*60*1000;
    var diffDays = Math.ceil(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    //console.log(startDate + " " + endDate + " number of days between: " + diffDays);
    var authors = [];
    var alreadyThere = false;
    for(u=0;u<globalData.length;u++) {
        //console.log("running");
        alreadyThere = false;
        for(i=0;i<authors.length;i++) {
            var stringA = globalData[u].handle;
            var stringB = authors[i].handle;
            //console.log("is " + stringA + " and " + stringB + " the same?");
            //console.log(stringA.localeCompare(stringB) === 0);
            if(stringA.localeCompare(stringB) === 0 && alreadyThere === false) {
                alreadyThere = true;
                authors[i].numberOfTweets = authors[i].numberOfTweets + 1;
            }
        }
        //console.log("is he already there? " + alreadyThere);
        if(alreadyThere === false) {
            var author = {
                name:globalData[u].tweeter,
                handle:globalData[u].handle,
                numberOfTweets:1,
            }
            //console.log("new author!" + globalData[u].tweeter);
            authors.push(author);
            //authors[authors.length-1].numberOfTweets = 1;
        }
        //console.log(authors);
    }
    //console.log(authors);
    var tweets = 0;
    for(h=0;h<authors.length;h++) {
        tweets = tweets + authors[h].numberOfTweets;
    }
    //console.log("number of tweets: " + tweets);

    var likes = 0;
    for(o=0;o<globalData.length;o++) {
        likes = likes + globalData[o].likes;
    }
    //console.log("number of likes overall: " + likes);
    var retweets = 0;
    for(n=0;n<globalData.length;n++) {
        retweets = retweets + globalData[n].retweets;
    }
    //console.log("Number of retweets " + retweets);
    //console.log("Number of authors " + " " + authors.length);
    var text = "<h3>Breakdown of #DST4L</h3><p>This dataset contains tweets from <strong>" + diffDays + "</strong> days, the " + startDate.getDate() + "/" + startDate.getMonth() + "-" + startDate.getFullYear() + " to " + endDate.getDate() + "/" + endDate.getMonth() + "-" + endDate.getFullYear() + ", which was <strong>" + tweets + "</strong> tweets written by <strong>" + authors.length + "</strong> authors using the hashtag #" + argument + ". This means an average of <strong>" + tweets/diffDays + "</strong> tweets per day. There was a total of <strong>" + likes + "</strong> likes on these tweets, giving an average of <strong>" + (likes/tweets).toFixed(2) + "</strong> likes per tweet. There was <strong>" + retweets + "</strong> retweets on these tweets, giving an average of <strong>" + (retweets/tweets).toFixed(2) + "</strong> retweets per tweet.</p>";
    document.getElementById("intro").innerHTML += text;
    addResetButton();
}


//Show Number of tweets, number of likes all over, number of tweeters, mosts tweets in what hour, etc.
function showOverallStatisticsForPerson(dataset, person) {
    var numberOfTweets = 0;
    var averageNumberOfTweets = 0;
    var numberOfLikes = 0;
    var numberOfRetweets = 0;
    var text = "<h3>Breakdown of " + person.handle + "</h3><p>User tweeted + " + numberOfTweets + " times during the entire measured period, which averages as " + averageNumberOfTweets + " tweets per day. These tweets recieved " + numberOfLikes + " likes, which averages " + (numberOfLikes/numberOfTweets).toFixed(2) + " likes per tweet, and " + numberOfRetweets + " retweets, which averages " + (numberOfRetweets/numberOfTweets).toFixed(2) + " retweets per tweet.</p>";
    document.getElementById("intro").innerHTML += text;
    addResetButton();
}
//List of contributers / procentage of tweets from every single contributor.
function showAllContributors(dataset) {
    //var canvas = document.getElementById("canvas");
    //var ctx = canvas.getContext("2d");
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    var contributors = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<contributors.length;u++) {
            if(contributors[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                contributors[u].tweetsByTweeter = contributors[u].tweetsByTweeter + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                tweetsByTweeter:1,
                name:dataset[i].tweeter,
            }
            contributors.push(tweeterObject);
            contributors[contributors.length-1].tweetsByTweeter = 1;
        }
    }
    contributors.sort(function(a, b) {return parseFloat(a.tweetsByTweeter) - parseFloat(b.tweetsByTweeter);});
    contributors.reverse();
    //console.log(contributors);
}

//List of most retweeted / procentage of retweets from the entire retweeters.
function showMostRetweeted(dataset,divZ) {
    var datasetNow = dataset;
    datasetNow.sort(function(a, b) {return parseFloat(a.retweets) - parseFloat(b.retweets);});
    datasetNow.reverse();
    //console.log(datasetNow);
    for(h=0;h<datasetNow.length;h++) {
        var fieldX = document.createElement('div');
        fieldX.id = "contributorField3-" + h;
        if(h % 2) {
            fieldX.className = "listContainerEntry even";
        }
        else {
            fieldX.className = "listContainerEntry unEven";
        }
        document.getElementById(divZ).appendChild(fieldX);
        document.getElementById("contributorField3-"+h).innerHTML = "<div class='fullTweet'><a href='" + datasetNow[h].link + "' target='_blank'>" +  datasetNow[h].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + datasetNow[h].handle.substring(1) + "'>" + datasetNow[h].handle + "</i>) - " + datasetNow[h].retweets + " retweets</div>";
    }
}
//List of most liked / procentage of all likes on the hashtag in that time interval.
function showMostLiked(dataset,divZ) {
    var datasetNow2 = dataset;
    datasetNow2.sort(function(a, b) {return parseFloat(a.likes) - parseFloat(b.likes);});
    datasetNow2.reverse();
    //console.log(datasetNow2);
    for(x=0;x<datasetNow2.length;x++) {
        var fieldY = document.createElement('div');
        fieldY.id = "contributorField2-" + x;
        if(x % 2) {
            fieldY.className = "listContainerEntry even";
        }
        else {
            fieldY.className = "listContainerEntry unEven";
        }
        //console.log(divZ);
        document.getElementById(divZ).appendChild(fieldY);
        document.getElementById("contributorField2-"+x).innerHTML = "<div class='fullTweet'><a href='" + datasetNow2[x].link + "' target='_blank'>" + datasetNow2[x].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + datasetNow2[x].handle.substring(1) + "'>" + datasetNow2[x].handle + "</i>) - " + datasetNow2[x].likes + " likes </div>";
    }
}

function PersonWithMostRetweets(dataset) {
    var retweeters = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<retweeters.length;u++) {
            if(retweeters[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                retweeters[u].allRetweets = retweeters[u].allRetweets + dataset[i].retweets;
                retweeters[u].numberOfTweets = retweeters[u].numberOfTweets + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                allRetweets:dataset[i].retweets,
                name:dataset[i].tweeter,
                numberOfTweets:1,
            }
            retweeters.push(tweeterObject);
        }
    }
    retweeters.sort(function(a, b) {return parseFloat(a.allRetweets) - parseFloat(b.allRetweets);});
    retweeters.reverse();
    for(k=0;k<retweeters.length;k++) {
        retweeters[k].retweetRatio = Math.round(retweeters[k].allRetweets/retweeters[k].numberOfTweets *100) / 100;
    }
    //console.log(retweeters);
}

function personWithMostLikes(dataset) {
    var likes = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<likes.length;u++) {
            if(likes[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                likes[u].allLikes = likes[u].allLikes + dataset[i].likes;
                likes[u].numberOfTweets = likes[u].numberOfTweets + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                allLikes:dataset[i].likes,
                name:dataset[i].tweeter,
                numberOfTweets:1,
            }
            likes.push(tweeterObject);
        }
    }
    likes.sort(function(a, b) {return parseFloat(a.allLikes) - parseFloat(b.allLikes);});
    likes.reverse();
    for(k=0;k<likes.length;k++) {
        likes[k].retweetRatio = Math.round(likes[k].allLikes/likes[k].numberOfTweets *100) / 100;
    }
    //console.log(likes);
}

function personWithHighestTweets(dataset,div) {
    var allTweets = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<allTweets.length;u++) {
            if(allTweets[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                allTweets[u].numberOfTweets = allTweets[u].numberOfTweets + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                allLikes:dataset[i].likes,
                name:dataset[i].tweeter,
                numberOfTweets:1,
            }
            allTweets.push(tweeterObject);
        }
    }
    allTweets.sort(function(a, b) {return parseFloat(a.numberOfTweets) - parseFloat(b.numberOfTweets);});
    allTweets.reverse();
    for(k=0;k<allTweets.length;k++) {
        allTweets[k].retweetRatio = Math.round(allTweets[k].allLikes/allTweets[k].numberOfTweets *100) / 100;
    }
    //console.log(allTweets);
    for(u=0;u<allTweets.length;u++) {
        var fieldZ = document.createElement('div');
        fieldZ.id = "contributorField1-" + u;
        if(u % 2) {
            fieldZ.className = "listContainerEntry even";
        }
        else {
            fieldZ.className = "listContainerEntry unEven";
        }
        document.getElementById(div).appendChild(fieldZ);
        document.getElementById("contributorField1-"+u).innerHTML = "<div class='tweeterName'>" + allTweets[u].name + " (<i><div class='handleOfUser'>" + allTweets[u].handle + "</div></i>) </div><div class='tweeterInfoOfName'>" + allTweets[u].numberOfTweets + " tweets </div>";
        document.getElementById("contributorField1-"+u).onclick=function(){showEntireEventTweetProgress(dataset,this.getElementsByClassName("handleOfUser")[0].innerHTML);};
    }
}

function mostPersonalLikedTweets(dataset, handle,div) {
    document.getElementById(div).innerHTML = "";
    var tweets = [];
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].handle === handle) {
            tweets.push(dataset[i]);
        }
    }
    tweets.sort(function(a, b) {return parseFloat(a.likes) - parseFloat(b.likes);});
    tweets.reverse();
    //console.log(tweets);
    for(u=0;u<tweets.length;u++) {
        var fieldZ = document.createElement('div');
        fieldZ.id = "contributorField2-" + u;
        if(u % 2) {
            fieldZ.className = "listContainerEntry even";
        }
        else {
            fieldZ.className = "listContainerEntry unEven";
        }
        document.getElementById(div).appendChild(fieldZ);
        //console.log(tweets[u].tweet + " " + tweets[u].likes + "<br/> ----");
        document.getElementById("contributorField2-"+u).innerHTML = "<div class='fullTweet'><a href='" + tweets[u].link + "' target='_blank'>" + tweets[u].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + tweets[u].handle.substring(1) + "'>" + tweets[u].handle + "</i>) - " + tweets[u].likes + " likes </div>";
    }
}

function mostPersonalRetweetedTweets(dataset, handle, div) {
    document.getElementById(div).innerHTML = "";
    var tweets = [];
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].handle === handle) {
            tweets.push(dataset[i]);
        }
    }
    tweets.sort(function(a, b) {return parseFloat(a.retweets) - parseFloat(b.retweets);});
    tweets.reverse();
    //console.log(tweets);
    for(u=0;u<tweets.length;u++) {
        var fieldZ = document.createElement('div');
        fieldZ.id = "contributorField3-" + u;
        if(u % 2) {
            fieldZ.className = "listContainerEntry even";
        }
        else {
            fieldZ.className = "listContainerEntry unEven";
        }
        document.getElementById(div).appendChild(fieldZ);
        //console.log(tweets[u].tweet + " " + tweets[u].likes + "<br/> ----");
        document.getElementById("contributorField3-"+u).innerHTML = "<div class='fullTweet'><a href='" + tweets[u].link + "' target='_blank'>" + tweets[u].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + tweets[u].handle.substring(1) + "'>" + tweets[u].handle + "</i>) - " + tweets[u].retweets + " retweets </div>";
    }
}

function sanatizeData(dataset) {
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].tweet.indexOf("pic.twitter.com") != -1) {
            //console.log(dataset[i].tweet.indexOf("pic.twitter.com"));
            //console.log(dataset[i].tweet);
            if(dataset[i].tweet.charAt(dataset[i].tweet.indexOf("pic.twitter.com")-1) != " ") {
                dataset[i].tweet = [dataset[i].tweet.slice(0, dataset[i].tweet.indexOf("pic.twitter.com")), " ", dataset[i].tweet.slice(dataset[i].tweet.indexOf("pic.twitter.com"))].join('');
                //console.log("New: " + dataset[i].tweet);
            }
        }
        if(dataset[i].tweet.indexOf("http://") != -1) {
            if(dataset[i].tweet.charAt(dataset[i].tweet.indexOf("http://")-1) != " ") {
                dataset[i].tweet = [dataset[i].tweet.slice(0, dataset[i].tweet.indexOf("http://")), " ", dataset[i].tweet.slice(dataset[i].tweet.indexOf("http://"))].join('');
                //console.log("New: " + dataset[i].tweet);
            }
        }
        if(dataset[i].tweet.indexOf("https://") != -1) {
            if(dataset[i].tweet.charAt(dataset[i].tweet.indexOf("https://")-1) != " ") {
                dataset[i].tweet = [dataset[i].tweet.slice(0, dataset[i].tweet.indexOf("https://")), " ", dataset[i].tweet.slice(dataset[i].tweet.indexOf("https://"))].join('');
                //console.log("New: " + dataset[i].tweet);
            }
        }
    }
}

function addResetButton() {
    var resetButton = document.createElement('div');
    resetButton.id = "resetButton";
    resetButton.className = "resetButton";
    document.getElementById("intro").appendChild(resetButton);
    document.getElementById("resetButton").innerHTML = "Reload overall statistics";
    document.getElementById("resetButton").onclick=function(){reshowFirstTwitterData();removePersonalStatistics();};
}

function removePersonalStatistics() {
   document.getElementById("personalVisualization").innerHTML = "";
}

function createEntirePersonalRelationsFrame(div,person) {
    var wheelContainer = document.createElement('div');
    wheelContainer.id = "wheelContainer";
    wheelContainer.className = "wheelContainer";
    document.getElementById(div).appendChild(wheelContainer);
    for(y=0;y<4;y++) {
        var wheelContainer = document.createElement('div');
        wheelContainer.id = "wheelContainerForSingleWheel" + y;
        wheelContainer.className = "wheelContainerForSingleWheel";
        document.getElementById("wheelContainer").appendChild(wheelContainer);
    }
    var personalRelationsContainer = document.createElement('div');
    personalRelationsContainer.id = "personalRelationsContainer";
    //console.log("HERE IT IS!!!! " + document.getElementById("wheelContainer").offsetHeight);
    personalRelationsContainer.style.height = document.getElementById("wheelContainer").offsetHeight; + "px";
    personalRelationsContainer.className = "personalRelationsContainer";
    document.getElementById(div).appendChild(personalRelationsContainer);
    likesOnTweets(globalData,person,"wheelContainerForSingleWheel0");
    retweetsOfTweets(globalData,person,"wheelContainerForSingleWheel1");
    engangementInTweets(globalData,person,"wheelContainerForSingleWheel2");
    tweetsOfEntireSet(globalData,person,"wheelContainerForSingleWheel3");
}

//https://jsfiddle.net/m96zt8mb/ - skal bruges til at smække opsætningen op.

//  Fix %-wheel with procent of tweets that was liked.
function likesOnTweets(dataset,person,div) {
    var tweets = 0;
    var likes = 0;
    var result = 0;
    var allLikes = 0;
    var average = 0;
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].likes != 0 && dataset[i].handle === person) {
            likes = likes + 1;
            tweets = tweets + 1;
        }
        else if(dataset[i].likes === 0 && dataset[i].handle === person) {
            tweets = tweets + 1;
        }
        if(dataset[i].likes != 0) {
            allLikes = allLikes + 1;
        }
    }
    var authors = findAllAuthors(dataset);
    average = (allLikes/authors) / (dataset.length/authors) * 100;
    result = likes/tweets * 100;
    //console.log(likes  + " - " + tweets);
    //console.log(average + " procentage of likes from " + authors + " doing " + allLikes + " liked tweets" + " all tweets " + dataset.length);
    createDiagram(div,0,"The procentage of tweets that was liked at least once", result,"#FF842B","grey",document.getElementById(div).clientHeight/3,likes,tweets,average);
}

// Fix %-wheel with procent of tweets that was retweeted.
function retweetsOfTweets(dataset,person,div) {
    var tweets = 0;
    var retweets = 0;
    var result = 0;
    var allRetweets = 0;
    var average = 0;
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].retweets != 0 && dataset[i].handle === person) {
            retweets = retweets + 1;
            tweets = tweets + 1;
        }
        else if(dataset[i].retweets === 0 && dataset[i].handle === person) {
            tweets = tweets + 1;
        }
        if(dataset[i].retweets != 0) {
            allRetweets = allRetweets + 1;
        }
    }
    var authors = findAllAuthors(dataset);
    average = (allRetweets/authors) / (dataset.length/authors) * 100;
    result = retweets/tweets * 100;
    //console.log(retweets  + " - " + tweets);
    //console.log(average + " procentage of retweets from " + authors + " doing " + allRetweets + " retweeted tweets");
    createDiagram(div,1,"The procentage of tweets that was retweeted at least once", result,"#FF842B","grey",document.getElementById(div).clientHeight/3,retweets,tweets,average);
}

// Fix %-wheel with procent of tweets had engagement with other users.
function engangementInTweets(dataset,person,div) {
    var tweets = 0;
    var tweetsWithUsers = 0;
    var result = 0;
    var tweetsFromAllusers = 0;
    var average = 0;
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].handle === person && dataset[i].tweet.indexOf("@") != -1 && dataset[i].tweet.charAt(dataset[i].tweet.indexOf("@")+1) != " ") {
            tweetsWithUsers = tweetsWithUsers + 1;
            tweets = tweets + 1;
        }
        else if(dataset[i].handle === person) {
            tweets = tweets + 1;
        }
        if(dataset[i].tweet.indexOf("@") != -1 && dataset[i].tweet.charAt(dataset[i].tweet.indexOf("@")+1) != " ") {
            tweetsFromAllusers = tweetsFromAllusers + 1;
        }
    }
    var authors = findAllAuthors(dataset);
    average = (tweetsFromAllusers/authors) / (dataset.length/authors) * 100;
    //average = tweetsFromAllusers/dataset.length * 100;
    result = tweetsWithUsers/tweets * 100;
    //console.log(retweets  + " - " + tweets);
    //console.log(average + " from " + tweetsFromAllusers + " tweets with engagement compared to all tweets " + dataset.length);
    createDiagram(div,2,"The procentage of tweets that had other users tagged in them", result,"#FF842B","grey",document.getElementById(div).clientHeight/3,tweetsWithUsers,tweets,average);
}

// Fix %-wheel number of tweets from person of entire dataset.
function tweetsOfEntireSet(dataset,person,div) {
    var tweets = 0;
    var result = 0;
    var average = 0;
    average = 0;
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].handle === person) {
            tweets = tweets + 1;
        }
    }
    authors = findAllAuthors(dataset);
    result = tweets/dataset.length * 100;
    average = dataset.length/authors;
    //console.log(retweets  + " - " + tweets);
    //console.log(average + " from + " + authors + " authors tweeting " + dataset.length);
    createDiagram(div,3,"The procentage of tweets from " + person + " in the entire dataset", result,"#FF842B","grey",document.getElementById(div).clientHeight/3,tweets,dataset.length,average);
}


function findAllAuthors(dataset) {
    var authors = [];
    for(u=0;u<globalData.length;u++) {
        //console.log("running");
        alreadyThere = false;
        for(i=0;i<authors.length;i++) {
            var stringA = globalData[u].handle;
            var stringB = authors[i].handle;
            //console.log("is " + stringA + " and " + stringB + " the same?");
            //console.log(stringA.localeCompare(stringB) === 0);
            if(stringA.localeCompare(stringB) === 0 && alreadyThere === false) {
                alreadyThere = true;
                authors[i].numberOfTweets = authors[i].numberOfTweets + 1;
            }
        }
        //console.log("is he already there? " + alreadyThere);
        if(alreadyThere === false) {
            var author = {
                name:globalData[u].tweeter,
                handle:globalData[u].handle,
                numberOfTweets:1,
            }
            //console.log("new author!" + globalData[u].tweeter);
            authors.push(author);
            //authors[authors.length-1].numberOfTweets = 1;
        }
        //console.log(authors);
    }
    return authors.length;
}

// Simple function to create the wheel
function createDiagram(div,id,info,procent,color1,color2,size,partNumber,fullNumber,average) {
  procent = parseFloat(procent.toFixed(1));
  document.getElementById(div).innerHTML = "<p>" + info + "</p>";
  var canvasForProcentages = document.createElement('canvas');
  canvasForProcentages.id = "canvasForProcentages" + id;
  canvasForProcentages.className = "canvasForProcentages";
  canvasForProcentages.width = size;
  canvasForProcentages.height = size;
  document.getElementById(div).appendChild(canvasForProcentages);
  var canvasForProcentagesCtx = canvasForProcentages.getContext("2d");
	var lastend = 0;
	var data = [procent,100-procent]; // If you add more data values make sure you add more colors
	var myTotal = 0; // Automatically calculated so don't touch
	var myColor = [color1,color2]; // Colors of each slice

	for (var e = 0; e < data.length; e++) {
 	 myTotal += data[e];
	}

	for (var i = 0; i < data.length; i++) {
 	 	canvasForProcentagesCtx.fillStyle = myColor[i];
  	canvasForProcentagesCtx.beginPath();
 	 	canvasForProcentagesCtx.moveTo(canvasForProcentages.width / 2, canvasForProcentages.height / 2);
 			 // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
  	canvasForProcentagesCtx.arc(canvasForProcentages.width / 2, canvasForProcentages.height / 2, canvasForProcentages.height / 2, lastend, lastend + (Math.PI * 2 * (data[i] / myTotal)), false);
  	canvasForProcentagesCtx.lineTo(canvasForProcentages.width / 2, canvasForProcentages.height / 2);
  	canvasForProcentagesCtx.fill();
  	lastend += Math.PI * 2 * (data[i] / myTotal);
	}
	canvasForProcentagesCtx.fillStyle = "rgba(81,70,105,1)";
	canvasForProcentagesCtx.beginPath();
	canvasForProcentagesCtx.moveTo(canvasForProcentages.width / 2, canvasForProcentages.height / 2);
	canvasForProcentagesCtx.arc(canvasForProcentages.width / 2,canvasForProcentages.height / 2,(canvasForProcentages.height / 2)-(canvasForProcentages.height / 10),0,2*Math.PI);
	canvasForProcentagesCtx.fill();
  var infoDiv = document.createElement('div');
  infoDiv.id = "info" + id;
  infoDiv.className = "infoDivForPie";
  infoDiv.style.width = size + "px";
  infoDiv.style.height = size + "px";
  infoDiv.style.marginTop = -size - 4 + "px";
  infoDiv.style.lineHeight = size + 5 + "px";
  infoDiv.style.textAlign = "center";
  infoDiv.style.fontSize = size/3.5 + "px";
  infoDiv.style.color = "rgba(255,255,255,1)";
  document.getElementById(div).appendChild(infoDiv);
  document.getElementById("info" + id).innerHTML = procent + "%";
  document.getElementById("info" + id).title = partNumber + " out of " + fullNumber;

  var compareDiv = document.createElement('div');
  compareDiv.className = "comparisonDiv";
  compareDiv.id = "compareDiv" + id;
  document.getElementById(div).appendChild(compareDiv);
  var statChooser;
  if(average < procent) {
      statChooser = "<div class='wheelStat positiveStat'>+" ;
  }
  else if(average > procent) {
      statChooser = "<div class='wheelStat negativeStat'>";
  }
  else if(average === procent) {
      statChooser = "<div class='wheelStat neutralStat'>=";
  }
  document.getElementById("compareDiv" + id).innerHTML = statChooser + (parseFloat(procent.toFixed(1))-parseFloat(average.toFixed(1))).toFixed(1) + "%</div><div>compared to average of dataset</div>";

  //console.log(average + " compared to " + partNumber + " out of " + fullNumber);
}

function personalOutwardRelations(dataset,person) {
    var tweetArray = [];
    var authorFrequency = [];
    for(h=0;h<dataset.length;h++) {
        if(dataset[h].handle === person) {
            tweetArray.push(dataset[h]);
        }
    }
    for(j=0;j<tweetArray.length;j++) {
        //console.log(tweetArray[j].tweet);
        var counter = (tweetArray[j].tweet.match(/@/g)||[]).length;
        var lastIndex = 0;
        var name;
        for(f=0;f<counter;f++) {
            name = "";
            name = tweetArray[j].tweet.substr(tweetArray[j].tweet.indexOf("@",lastIndex),tweetArray[j].tweet.indexOf(" ",tweetArray[j].tweet.indexOf("@",lastIndex)+1)-tweetArray[j].tweet.indexOf("@",lastIndex));
            if(name === "" && tweetArray[j].tweet.indexOf(" ",tweetArray[j].tweet.indexOf("@",lastIndex)+1) === -1) {
                name = tweetArray[j].tweet.substr(tweetArray[j].tweet.indexOf("@",lastIndex),tweetArray[j].tweet.indexOf(" ",(tweetArray[j].tweet.length-1)-tweetArray[j].tweet.indexOf("@",lastIndex)));
            }
            if(name.charAt(name.length -1) === "." || name.charAt(name.length -1) === "!" || name.charAt(name.length -1) === "?" || name.charAt(name.length -1) === ",") {
                name = name.slice(0, -1);
            }
            if(name.substr(name.length - 2,2) === "’s") {
                name = name.slice(0,-2);
            }
            var authorPresent = false;
            for(y=0;y<authorFrequency.length;y++) {
                //console.log(name.toLowerCase() + " and " + authorFrequency[y].name.toLowerCase());
                if(name.toLowerCase() === authorFrequency[y].name.toLowerCase()) {
                    authorPresent = true;
                    authorFrequency[y].number = authorFrequency[y].number + 1;
                }
            }
            if(authorPresent === false) {
                var authorObject = {
                    name:name,
                    number:1,
                    randomNumber: Math.floor((Math.random() * 100) + 0),
                };
                if(authorObject.name != "@") {
                authorFrequency.push(authorObject);
                }
            }
            //console.log(f + " at: " + tweetArray[j].tweet.indexOf("@",lastIndex) + " to " + tweetArray[j].tweet.indexOf(" ",tweetArray[j].tweet.indexOf("@",lastIndex)+1) + " name: " + name);
            lastIndex = tweetArray[j].tweet.indexOf("@",lastIndex) + 1;
        }
        //console.log(counter);
    }
    showPersonalOutwardRelations(authorFrequency,person);
}

function showPersonalOutwardRelations(dataArray,person) {
    //console.log(dataArray);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.id = "personalRelationsCanvas";
    canvas.width = document.getElementById("personalRelationsContainer").clientWidth;
    canvas.height = document.getElementById("personalRelationsContainer").clientHeight;
    document.getElementById("personalRelationsContainer").appendChild(canvas);
    //centerpiece
    ctx.font = "14px Trebuchet MS";
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillText(person,document.getElementById("personalRelationsContainer").clientWidth/2-ctx.measureText(person).width/2,document.getElementById("personalRelationsContainer").clientHeight/2);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(document.getElementById("personalRelationsContainer").clientWidth/2,document.getElementById("personalRelationsContainer").clientHeight/2-4,ctx.measureText(person).width/2+5,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    var calHeight = 0;
    if(document.getElementById("personalRelationsContainer").clientWidth>=document.getElementById("personalRelationsContainer").clientHeight) {
        calHeight = document.getElementById("personalRelationsContainer").clientHeight/2;
    }
    else {
        calHeight = document.getElementById("personalRelationsContainer").clientWidth/2;
    }
    var highestValue = 0;
    for(i=0;i<dataArray.length;i++) {
        if(dataArray[i].number > highestValue) {
            highestValue = dataArray[i].number;
        }
    }
    var longestName = 0;
    for(c=0;c<dataArray.length;c++) {
        if(ctx.measureText(dataArray[c].name).width > longestName) {
            longestName = ctx.measureText(dataArray[c].name).width;
        }
    }
    calHeight = calHeight - 20;// - (longestName/2);
    //console.log(highestValue + " yeaaaaaaaaaaa");
    dataArray.sort(function(a, b) {return parseFloat(a.randomNumber) - parseFloat(b.randomNumber);});

    //All the person entries around center
    var TO_RADIANS = Math.PI/180;
    var angle = 0;
    //console.log(dataArray.length);
    for(u=0;u<dataArray.length;u++) {
        var color1 =  Math.floor((Math.random() * 150) + 0);  //Math.round((255/dataArray.length)*u);
        var color2 =  Math.floor((Math.random() * 105) + 150);//Math.round(255 - ((255/dataArray.length)*u));
        var opacity = dataArray[u].number/highestValue;
        //console.log(opacity);
        color = "rgba(" + color1 + ",127," + color2 + "," + opacity + ")";
        ctx.strokeStyle = color;
        //console.log(ctx.measureText(dataArray[u].name).width);
        //distance = ctx.measureText(dataArray[u].name).width;
        //console.log(dataArray[u].number/highestValue + " from " + dataArray[u].name);
        distance = ((dataArray[u].number/highestValue) * (calHeight-(longestName))) - 10; //dataArray[u].number * highestValue;
        //console.log(distance + " translated from " + dataArray[u].number + " from " + dataArray[u].name);
        var x2 = document.getElementById("personalRelationsContainer").clientWidth/2 + Math.cos(angle * TO_RADIANS) * (calHeight - distance);
        var y2 = document.getElementById("personalRelationsContainer").clientHeight/2 + Math.sin(angle * TO_RADIANS) * (calHeight - distance);

        var x3 = document.getElementById("personalRelationsContainer").clientWidth/2 + Math.cos(angle * TO_RADIANS) * (ctx.measureText(person).width/2+5);
        var y3 = document.getElementById("personalRelationsContainer").clientHeight/2 + Math.sin(angle * TO_RADIANS) * (ctx.measureText(person).width/2+5);
        ctx.beginPath();
        ctx.arc(x3,y3-4,2,0,2*Math.PI);
        //ctx.arc(x2,y2-5,ctx.measureText(dataArray[u].name).width/2+5,0,2*Math.PI);
        ctx.fillStyle = "rgba(255,255,255," + opacity + ")";
        ctx.fillText(dataArray[u].name,x2-ctx.measureText(dataArray[u].name).width/2,y2);
        ctx.fillStyle = color;
        ctx.fillText(dataArray[u].number + " mentions",x2-ctx.measureText(dataArray[u].number + " mentions").width/2,y2+13);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x3,y3-4);
        ctx.lineTo(x2,y2-4);
        ctx.stroke();
        //console.log(angle);
        angle = ((360/dataArray.length) * (u+1));
    }
}
