const el = document.getElementById('card-container');
const sortable = new Sortable(el, {
  animation: 150,
  ghostClass: 'ghost-class',
  delay: 50,
  delayOnTouchOnly: true
});

export default sortable;