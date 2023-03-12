const viewMore = document.getElementById('view-more');
const viewMoreBtn = document.getElementById('view-more-btn');
var isOpen = false;
const ring = document.getElementById('ring');
const imgBtn = document.getElementById('ring-btn');

imgBtn.addEventListener('mouseenter',()=>{
    imgBtn.style.transform="scale(1.02)";
    ring.style.right="30rem";
    ring.style.transition=".3s linear";
    imgBtn.style.transition=".3s linear";
    imgBtn.style.boxShadow="0 0 5px gray";
})
imgBtn.addEventListener('mouseleave',()=>{
    imgBtn.style.transform="scale(1)";
    ring.style.right="24rem";
    ring.style.transition=".3s linear";
    imgBtn.style.transition=".3s linear";
    imgBtn.style.boxShadow="none";
})

viewMoreBtn.addEventListener('mouseenter',()=>{
    viewMore.style.display="flex";
})
viewMore.addEventListener('mouseenter',()=>{
    viewMore.style.display="flex";
    isOpen=true;
})

if(!isOpen){
    viewMoreBtn.addEventListener('mouseleave',()=>{
        setTimeout(()=>{
            viewMore.style.display="none";
        },1000);
    })
}
