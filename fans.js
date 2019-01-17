let chrome = require('./util/chrome');

let config = {
	raw: '',
	me: ''
};

let token = ''

function Sleep(Time) {
	return new Promise(reject=>{
		setTimeout(()=>{
			reject(null)
		}, Time)
	})
}

async function GetFensList(prevList) {
	let prevTime = (prevList && prevList.length > 0) ? prevList[prevList.length - 1].updatedAtString : ''
	let list = await chrome.get('https://follow-api-ms.juejin.im/v1/getUserFollowerList', {}, {}, {
		uid: config.raw,
		currentUid: config.me,
		src: 'web',
		before: prevTime
	})
	return list.data.d
}


async function ToFans(uid) {
	let info = await chrome.get('https://follow-api-ms.juejin.im/v1/follow', {}, {}, {
		follower: config.me,
		followee: uid,
		token: token,
		device_id: 1546389582912,
		src: 'web'
	})
	return info.data
}

;(async function () {

	let list = [{
		updatedAtString: '2019-01-13T16:12:39.626Z', //最后一次关注的人的断点
	}]
	let init = true

	while(list.length > 0 || init) {
		init = false
		list = await GetFensList(list)
		for(let i=0; i<list.length; i++) {
			let user = list[i]
			let flowInfo = await ToFans(user.follower.objectId)

			if(flowInfo.m === 'ok') {
				console.log(`关注成功${user.follower.username} ${user.updatedAtString}`)
			} else {
				console.log(`关注失败`)
			}
			console.log('休息,1s')
			await Sleep(1000)
		}
		console.log('休息,10s')
		await Sleep(10000)
	}

})();

