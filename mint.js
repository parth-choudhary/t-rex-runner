const API_KEY = 'test_key.JpKp9B.-O2RYL0ZjXVLt'

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.8.4/firebase-storage.min.js"

import './html2canvas.min.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBWMhFi29OmENJPhcIueATaVNc5iDm3npI",
authDomain: "kbw2022-966ad.firebaseapp.com",
projectId: "kbw2022-966ad",
storageBucket: "kbw2022-966ad.appspot.com",
messagingSenderId: "203158962745",
appId: "1:203158962745:web:1ad454959b9257fdb403e8",
measurementId: "G-HTW677W204"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

window.minted = false
window.minting = false


document.getElementById('mint-button').addEventListener('click', function(){
    console.log('mint button click')

    if (window.minting) {
        console.log('minting true click')
        return
    }
    if (window.minted) {
        console.log('minted true click')
        window.open(`https://polygonscan.com/tx/$window.mintTxId`, '_blank').focus();
        return
    }
    console.log('mint clicked')
    mintNFT()
})

    function mintNFT() {

        document.querySelector('#mint-button').innerText = "Minting...";
        window.minting = true

        document.querySelector('#score-nft-container').style.display = 'block'
        setTimeout(() => {
        html2canvas(document.querySelector('#score-nft-container'), {
            scale: 5,
            width: 300,
            height: 300
        }).then(canvas => {
            // document.querySelector('#score-nft-container').style.display = 'none'

            canvas.toBlob(function(blob){
                uploadScoreToStorage(blob, Date.now().toString(), async (imageUrl) => {
                    console.log(imageUrl)

                    let score = Math.round(window.runner.highestScore * 0.025)

                    mintNft(score, imageUrl, (mintData) => {
                        let walletId = localStorage.getItem('wallet_id')
                        airdropNft(mintData.id, walletId, (airdropData) => {
                           console.log('minted')
                           document.querySelector('#mint-button').innerText = "Minted (View on Polygonscan)";
                           console.log('tx hash: ' + airdropData.mintTxId)
                           window.minting = false
                           window.minted = true
                           window.mintTxHash = airdropData.mintTxId
                        })
                    })
                })
              },'image/png');
        });
    }, 500)
    }

    function uploadScoreToStorage(blob, key, uploadCallback) {
        let username = localStorage.getItem('username');

        if(username == null) {
            console.log("username undefined, aborting..")
            return;
        }

        let storageRef = ref(storage, `nfts/${username}/${key}`)
        console.log(blob)
        uploadBytes(storageRef, blob).then(() => {
            getDownloadURL(storageRef).then((url) => {
                uploadCallback(url)
            })
        })
    }
    
    function mintNft(score, imageUrl, callback) {
    const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: {
            attributes: [
              {trait_type: 'Score', value: score},
              {trait_type: 'Player', value: localStorage.getItem("username"), display_type: 'string'},
            ],
            name: 'Croak score',
            description: 'Croak high score for ' + localStorage.getItem("username"),
            image: imageUrl,
            external_url: 'https://croak.xyz'
          },
          supply: 1,
          assetContractId: '62f48bec4460b318008e5f92',
          reserveTokenDataId: '62f3ee5b4460b318008e4c2e',
          reserveTokenDataAmount: 1
        })
      };
      
      fetch('https://be.namasteapis.com/blockchain/v1/token-data/create', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            callback(response.data)
        })
        .catch(err => console.error(err));
}

function airdropNft(tokenId, walletId, callback) {
    const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destinations: [walletId],
          amounts: [1],
          tokenDataId: tokenId
        })
      };
      
      fetch('https://be.namasteapis.com/blockchain/v1/airdrop/token-data', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            callback(response.data[0])
        })
        .catch(err => console.error(err));
}