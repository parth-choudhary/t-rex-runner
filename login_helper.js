


async function checkForLogin(){
    await window.croakWallet.init({
        'clientId': '62de50119081671256277626',
        chain: 'polygon',
        authNetwork: 'testnet'
      }
    );
    if(await window.croakWallet.isConnected()){
        var event = new CustomEvent("show_two_init", {});
        localStorage.setItem(
            'wallet_id', await window.croakWallet.getWalletID())
        var userInfo = await window.croakWallet.getUserInfo();
        localStorage.setItem('username', userInfo.name)
        

        document.dispatchEvent(event);
    }
}


function onDocumentLoad() {
    checkForLogin();
}


document.addEventListener('DOMContentLoaded', onDocumentLoad);

document.getElementById('login-image').addEventListener(
    'click', function(){
        console.log('login baby');
        window.croakWallet.login("google", window.location.href)
})
