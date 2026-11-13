(function(){
  const run=()=>{
    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes=document.querySelectorAll('.home-v43-section-heading,.home-v43-category,.home-v43-photo-card,.home-v43-knowledge-card,.home-v43-path-card,.home-v43-daily-item,.home-v43-bottom-panel,.home-section-heading,.home-gateway,.home-daily-item,.home-progress-card,.home-feature-card,.home-knowledge-card,.home-learning-card,.home-book-card,.home-topic-card,.home-spotlight-card,.home-curated-card,.catalog-card,.knowledge-panel,.knowledge-card,.archive-card,.feature-card,.profile-panel');
    if(!nodes.length||reduced)return;
    document.body.classList.add('motion-ready');
    nodes.forEach(node=>node.classList.add('motion-item'));
    if(!('IntersectionObserver'in window)){nodes.forEach(node=>node.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{rootMargin:'0px 0px -35px 0px',threshold:.06});
    nodes.forEach(node=>observer.observe(node));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
