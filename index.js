const url = 'https://www.instagram.com/louisvuitton/'; 	
const firstDate = Date.now(),
		lastDate = Date.parse("2021-11-17T19:27:47.000Z");
const login = "21_muslima_optom_turkey", 
		password = "Mirin00.5";		
// Логин пороль страницы под бота
//"almakci_programulu"
//"Mirin00.5"
const wait = (delay, ...args) => new Promise(resolve => setTimeout(resolve, delay, ...args));
const puppeteer = require('puppeteer');
const fs = require('fs'),
	fsp = require('fs').promises,
 	request = require('request');
async function logIn(username, password, manePage){
	await manePage.waitForSelector(`button[type=submit]`);
	await manePage.type('input[name=username]',username,{delay:50});
	await manePage.type('input[name=password]',password,{delay:50});
	await manePage.click('button[type=submit]');		
	async function cod(){ 
		if(await manePage.$('._5f5mN.jIbKX.KUBKM.yZn4P') != null){
			console.log('Waiting for security code sende on phone...');
			await manePage.click('._5f5mN.jIbKX.KUBKM.yZn4P');
			await manePage.waitForSelector(`#security_code`);
		   return await manePage.waitForFunction(() => {
		        const security_code = document.getElementById('security_code');
		       return security_code.value !== "" 
		    },{timeout : 0});
		}
		if(await manePage.$('._2hvTZ.pexuQ.zyHYP') != null){
			console.log('Waiting for security code sende on phone...');
		   return await manePage.waitForFunction(() => {
	      	const security_code = document.getElementsByClassName('_2hvTZ pexuQ zyHYP');
	         return security_code.value !== "" 
		   },{timeout : 0});
		}
		if(await manePage.$('._5f5mN.jIbKX.KUBKM.yZn4P' != null)){await cod();}	
	}
	return;
}
async function logOut(manePage){
	await manePage.click(`._2dbep.qNELH`);
	await manePage.waitForSelector('.-qQT3:nth-child(6)');
	await manePage.click('.-qQT3:nth-child(6)');
	await wait(3000);
	if(await manePage.$('.Igw0E.rBNOH.eGOV_._4EzTm.oxOrt>button') != null){
		await manePage.click('.Igw0E.rBNOH.eGOV_._4EzTm.oxOrt>button');
	}
	if(await manePage.$('.aOOlW.bIiDR') != null){
		await manePage.click('.aOOlW.bIiDR');
	} 
}
async function saveCookies(manePage){
	await wait(5000);
	if(await manePage.$('.JErX0>button') != null){
		await manePage.waitForSelector('.JErX0>button');
		await manePage.click('.JErX0>button');
	}
	const cookies = await manePage.cookies();
	await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2),function (err, data){});
	await manePage.waitForNavigation();
	if(await manePage.$('.aOOlW.HoLwm') != null){
		await manePage.click('.aOOlW.HoLwm');
	}
}
async function setCookies(manePage){
	const cookiesString = await fsp.readFile('./cookies.json', function (err, data){});
	const cookies = JSON.parse(cookiesString);
	await manePage.setCookie(...cookies);
}		
async function goToPage(page,value){
	await page.goto(value);
	await page.waitForSelector(`.FFVAD`);
}
//time
async function checkFirstDate(page){
	let pageDate = await page.evaluate(() => {
		return document.querySelector(`._1o9PC.Nzb55`).getAttribute('datetime');
	});
	return (Date.parse(pageDate) <= firstDate)
}
async function checkLastDate(page){
		let pageDate = await page.evaluate(() => {
		return document.querySelector(`._1o9PC.Nzb55`).getAttribute('datetime');
	});
	return (Date.parse(pageDate) >= lastDate)
}
//
async function getEvalResult(page){
	const  result = await page.evaluate(() => { 
	let innerResult = {description : '', account : '',cod: ''};
	//Description
	if(document.querySelector(`div.C4VMK > span`) == null){
		innerResult.description = '';
	}
	else{ 
		description = document.querySelector(`div.C4VMK > span`).innerHTML;
		innerResult.description= description.toLowerCase();
	}
	//Account name
	innerResult.account = document.querySelectorAll('.sqdOP.yWX7d._8A5w5.ZIAjV')[0].innerHTML;
	//Product code
	return innerResult;
	});
	let codLoc = result.description.search("code");
	result.cod = result.description.substring(codLoc, codLoc+20);
	console.log(result.cod);
	return result
}
async function getEvalImgSrc(page){
	await page.waitForSelector(`.FFVAD`);
	let img_src;
	if(await page.$('.Ckrof') != null){
		img_src = await page.evaluate(() => {
			let parents = document.querySelectorAll(".Ckrof");
			let ret = {};
			for (i = parents.length - 1; i >= 0; i--) {
					ret[i] = parents[i].querySelectorAll('.FFVAD')[0].getAttribute('src');
			}
			return ret;
		});
	}
	else{
		img_src = await page.evaluate(() => {
			let parents = document.querySelectorAll(".Ckrof");
			let ret = {};
			ret[0] = document.querySelectorAll('.FFVAD')[0].getAttribute('src');
			return ret;
		});
	}
	console.log(img_src);
	return img_src;
}
async function writSilderSrcToResult(resultImg_src, img_src, page){
	function writToResult(resultImg_src, img_src){
		for (const [key, value] of Object.entries(img_src)){
			if(Object.values(resultImg_src).indexOf(value) == -1){
				resultImg_src[key] = value;
			}
		}
	}
	await page.waitForSelector(`.FFVAD`);
	let sliderLength = await page.evaluate(() => {return document.querySelectorAll(".Yi5aA ").length});
 	for (i = sliderLength - 2; i >= 0; i--) {
		await page.click('._6CZji');
		img_src = await page.evaluate(() => {
			let parents = document.querySelectorAll(".Ckrof");
			let ret = {};
			for (ind = parents.length - 1; ind >= 0; ind--) {
  				ret[ind] = parents[ind].querySelectorAll('.FFVAD')[0].getAttribute('src');
			}
			return ret;
		});
		writToResult(resultImg_src, img_src);
	}
}		
(async function(){
	const browser = await puppeteer.launch({headless: false});
	const manePage = await browser.newPage();
	await setCookies(manePage);
	await manePage.setViewport({ width: 1280, height: 800 });
	await setCookies(manePage);
	await manePage.goto(url);
	await wait(3000).then(async()=>{
		if(await manePage.$('.ENC4C>.sqdOP.L3NKy.y3zKF') != null){await manePage.click('.ENC4C>.sqdOP.L3NKy.y3zKF'); await wait(3000)}
		if(await manePage.$('input[name=username]') != null || await manePage.$('button[type="submit"]') != null){
			await logIn("akmakci_programulu", "Mirin00.5", manePage);
			await saveCookies(manePage);
		}
	});
  await manePage.waitForSelector(`.v1Nh3.kIKUG._bz0w>a`);
  	let links = {};
  	const redyHrefs = async(links,key) => {
	return JSON.parse(await manePage.evaluate((links,key) => {
			let k = key;
			let elms = document.querySelectorAll('.v1Nh3.kIKUG._bz0w>a');
			for (let i = 0;i <= elms.length - 1; i++) {
				let pushLink = 'https://www.instagram.com/' + elms[i].getAttribute('href');
				if(Object.values(links).indexOf(pushLink) == -1){
					k++;
					links[k] = pushLink;
				}
			}
			return JSON.stringify(links);
		}, links,key));
  	}  
  	resultData = {};
  	let key = 0;//общее количество лупов
  	let ke = 0;//количество лупов с записю захлдяших в if
  	let hrefs = await redyHrefs(links,-1);
  	if(typeof hrefs === "object"){
  	let page = await browser.newPage();    		          
		 do{
		 value = hrefs[key];
			await goToPage(page,value);
			if(!(await checkLastDate(page))){
				console.log('break');
				await page.close();
				break;
			}
			if(await checkFirstDate(page)){
				let result = await getEvalResult(page);
				let img_src = await getEvalImgSrc(page);
				if(img_src[1] != undefined){
					result['img_src'] = {};
					await writSilderSrcToResult(result.img_src, img_src, page);
				}
				resultData[ke] = {imgEncoded : '', description: '', account: '', cod:''};
				let imgFileName;
				if(typeof result.img_src === 'object'){
					imgFileName = {};
					for (const [k, v] of Object.entries(result.img_src)){
						imgFileName[k] = 'photos_from_instagram/'+result.account+' '+ke+'('+k+')'+'.jpg';
						await request.head(result.v, function(err, res, body){
							request(v).pipe(fs.createWriteStream(imgFileName[k]));
						});	
					}
				}
				else{
					img_src = await page.evaluate(() => {
						let ret = '';
						if(document.querySelector('.tWeCl') == null){
							ret = document.querySelector('.FFVAD').src
						}
						else{
							///for video
							try{
								ret = document.querySelector('.tWeCl').getAttribute('poster');
							}
							catch(e){}	
						}
						return ret;
					});
					imgFileName = 'photos_from_instagram/'+ result.account+' '+ke +'.jpg';
					request.head(img_src, function(err, res, body){
						request(img_src).pipe(fs.createWriteStream(imgFileName));
					});
				}	
				resultData[ke].imgEncoded = imgFileName;
				resultData[ke].description = result.description;
				resultData[ke].account = result.account;
				resultData[ke].cod = /*result.cod*/"krk-"+ke;
				ke++;
			}
			key++;
			var isPageInDate = await checkLastDate(page);
			if(value == hrefs[Object.keys(hrefs).length - 1]){
				await page.close();
				console.log('yes');
				let scrollHeight = await manePage.evaluate(() => {
					window.scrollTo(0,document.body.scrollHeight);
					let scrollHeight = document.body.scrollHeight
					return scrollHeight;
				});
				await wait(5000);
				hrefs = await redyHrefs(hrefs,key-1);
				page = await browser.newPage();
			}
		}while(isPageInDate);
	}
	else{
		let page = await browser.newPage();
		await goToPage(page, hrefs[0]);
		if(!(await checkLastDate(page))){
			await page.close();
		}
		else{
			let result = await getEvalResult(page);
			let img_src = await getEvalImgSrc(page);
			if(img_src[1] != undefined){
				result['img_src'] = {};
				await writSilderSrcToResult(result.img_src, img_src, page);
			}
			resultData.imgEncoded = img_src;
			resultData.description = result.description.toLowerCase();
			resultData.account = result.account;
			resultData.cod = result.cod;
		}
		await page.close();
	}
	const stringifyed = JSON.stringify(resultData);
	await fs.writeFileSync('pursedData/'+resultData[0].account+'.json', stringifyed );
	///Запись на указоный выше инстаграм
	const fcs = await browser.newPage();
	await fcs.goto('https://business.facebook.com/creatorstudio/home');
	await fcs.click('#media_manager_chrome_bar_instagram_icon');
	let pages = await browser.pages();
	await fcs.setViewport({ width: 1280, height:600 });
	//save target of original page to know that this was the opener:     
	const pageTarget = fcs.target();
	//execute click on first tab that triggers opening of new tab:
	await fcs.waitForSelector('.qku1pbnj.j8otv06s.ippphs35.a1itoznt.qwtvmjv2.svz86pwt.a53abz89.tds9wb2m');
	await fcs.click('.qku1pbnj.j8otv06s.ippphs35.a1itoznt.qwtvmjv2.svz86pwt.a53abz89.tds9wb2m');
	//check that the first page opened this new page:
	const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
	//get the new page object:
	const tab = await newTarget.page();
	await logIn(login, password, tab);
	await tab.waitForNavigation({ waitUntil: 'networkidle0' });
	if(await tab.$('.JErX0>button') != null){
		await tab.waitForSelector('.JErX0>button');
		await tab.click('.JErX0>button');
	}
	const cookies = await tab.cookies();
	await fs.writeFile(('./cookiesFcs.json'), JSON.stringify(cookies, null, 2),function (err, data){});
	await fcs.waitForNavigation();
	const cookiesString = await fsp.readFile('./cookiesFcs.json', function (err, data){});
	const cookie = JSON.parse(cookiesString);
	await fcs.setCookie(...cookie);
	let jsonReaded = fs.readFileSync('pursedData/'+resultData[0].account+'.json');
	let posts = JSON.parse(jsonReaded);
	for (var q = Object.keys(posts).length - 1; q >= 0; q--) {
		let post = posts[q];
		let productCod = post.cod;
		await fcs.waitForSelector('.qku1pbnj.j8otv06s.ippphs35.a1itoznt.qwtvmjv2.svz86pwt.a53abz89.tds9wb2m');
		await fcs.click('.qku1pbnj.j8otv06s.ippphs35.a1itoznt.qwtvmjv2.kiex77na.lgsfgr3h.mcogi7i5.ih1xi9zn.a53abz89');
		await fcs.waitForSelector('.qku1pbnj.j8otv06s.r05nras9.a1itoznt.te7ihjl9.svz86pwt.q3s3exew.d8d6zf0d.p66o6c86.a53abz89');	
		await fcs.click('.qku1pbnj.j8otv06s.r05nras9.a1itoznt.te7ihjl9.svz86pwt.q3s3exew.d8d6zf0d.p66o6c86.a53abz89');
		//await fcs.waitForSelector('div._1mf._1mj');
		//await fcs.click('div._1mf._1mj');
		await fcs.waitForSelector('div.notranslate._5rpu');
     	await fcs.type('div.notranslate._5rpu',productCod,{delay:50});
		await fcs.waitForSelector('.accessible_elem._5f0v');
		await fcs.evaluate(() => {
			let first =document.querySelector('._7-iu._3qn7._61-3._2fyi._1a9e').firstChild;
			first.scrollTop = first.scrollHeight;
			document.querySelectorAll('.accessible_elem._5f0v')[1].click();
		});
		await fcs.waitForSelector('._n._5f0v');
		let fileInputs = await fcs.$$('._n._5f0v');
		let input = fileInputs[fileInputs.length - 1];
		await fcs.click('._n._5f0v');
      if(typeof post.imgEncoded == 'object'){
      	let files = [];
      	for (const [kilt, value] of Object.entries(post.imgEncoded)){
      		files[kilt] = value;
      	}
      	await input.uploadFile(...files);
      }
      else{
     		await input.uploadFile(post.imgEncoded);
     	}
		await fcs.waitForSelector('button._271k._271m._1qjd');
     	await fcs.click('button._271k._271m._1qjd');
     	await fcs.waitForSelector('.img.sp_qpo8dl7oKLd.sx_d4e08d', {timeout: 0});
     	await fcs.waitForSelector('._6x5h.img.sp_mb7JremnxFb.sx_3e93d5', {timeout: 0});
     	await wait(1000);
     	await fcs.click('._6x5h.img.sp_mb7JremnxFb.sx_3e93d5');
     	do{await wait(500)}while(await fcs.evaluate(() => document.querySelectorAll('.img.sp_qpo8dl7oKLd.sx_d4e08d').length) != 0);
	} 
})();

