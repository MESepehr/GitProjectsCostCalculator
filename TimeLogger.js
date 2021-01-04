var fs = require('fs');

fs.readFile('logs.txt', 'utf8', logsLoaded);

var minimomJob = 60*60*1000*6 ;
var minmomDelta = Math.min(minimomJob,9*60*60*1000) ;
var developerPricePerHoure = 25000 ;// toman

function logsLoaded(err, data){
    if (err) throw err;

    var splitedCommits = data.split(/[\n\r]*commit [^\n^\t^\r^\s]+[\n\r]/g) ;
    var times = {};
    for(var i = 0 ; i<splitedCommits.length ; i++)
    {
        /**Author: mahooresorkh <mahooresorkh@gmail.com> Date: Sat Jan 2 11:10:04 2021 +0330 some modifications 1- registerdoc API for innerletter and exportedletter has been modified */
        var currentCommit = '';
        currentCommit = splitedCommits[i];
        if(currentCommit=='')continue;

        var Author = currentCommit.substring(currentCommit.indexOf("Author: ")+8)//String(currentCommit).replace(/[\n\r\s]*Author:\s([^\s]+)\s*[^$]*/,'$1');
            Author = Author.substring(Author.indexOf('<')+1);
            Author = Author.substring(0,Author.indexOf('>'));
            
        var Datev = currentCommit.substring(currentCommit.indexOf("Date: ")+6)//String(currentCommit).replace(/[\n\r\s]*Author:\s([^\s]+)\s*[^$]*/,'$1');
            Datev = Datev.substring(0,Datev.indexOf('\n'));//new Date(String(currentCommit).replace(/^[\n\r\s]*[^\r^\n]+[\r\n]Date:[\t\s]*([^\r^\n]+)[^$]*/,'$1'));

        if(Datev.toString()=="Invalid Date")
        {
            console.log("Caution!!");
        }

        if(times[Author]===undefined)
        {
            times[Author]=[];
        }
        times[Author].unshift(Datev);
    }
    var totalTimeOnProject = 0 ;
    for(var i in times)
    {
        console.log("Auter:"+i+" jobs>"+times[i].length);
        let sumInMilisecond = 0 ;
        let currentTime = new Date() ;
        let lastTime = new Date() ;
        lastTime = null ;
        for(var j = 0 ; j<times[i].length ; j++)
        {
            var cDate = new Date();
            cDate = times[i][j];

            if(lastTime===null)
            {
                lastTime = new Date(cDate) ;
                continue ;
            }
            currentTime = new Date(cDate) ;

            if(lastTime.toString()==="Invalid Date" || currentTime.toString()==="Invalid Date")
            {
                console.log("Warning");
            }

            let deltaTime = currentTime.getTime()-lastTime.getTime() ;
            
            if(deltaTime<minmomDelta)
            {
                sumInMilisecond += deltaTime ;
            }
            else
            {
                sumInMilisecond += minimomJob ;
            }

            // if(lastTime.getDate()!=currentTime.getDate() && lastTime.getMonth()!=currentTime.getTime())
            // {
            //     console.log("new Date :‌"+currentTime.toString());
            // }

            lastTime = new Date(cDate) ;
        }

        console.log("Working time in houre: "+roundedTime(sumInMilisecond));
        totalTimeOnProject+=sumInMilisecond;
    }

    console.log("\n \n");
    console.log("Total time : "+roundedTime(totalTimeOnProject));
    console.log("Pure cost:"+priceShow(roundedTime(totalTimeOnProject)*developerPricePerHoure));
    console.log("Real cost:"+priceShow(roundedTime(totalTimeOnProject)*developerPricePerHoure*2.4));
    console.log("Sood deh cost:"+priceShow(roundedTime(totalTimeOnProject)*developerPricePerHoure*3.4));

}

function priceShow(price)
{
    var priceStr = Math.round(price).toString();
    for(var i = 3 ; i<priceStr.length ; i+=3)
    {
        priceStr = priceStr.substring(0,priceStr.length-i)+','+priceStr.substring(priceStr.length-i);
        i++;
    }
    return priceStr ;
}

function roundedTime(timeInMilisecond)
{
    return Math.round((timeInMilisecond/(1000*60*60))*10)/10;
}