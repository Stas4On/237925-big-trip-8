export default (name, isChecked = false) => `<input 
  type="radio" 
  id="filter-${name}" 
  name="filter" 
  value="${name}" 
  ${isChecked ? `checked` : ``}>
          
  <label class="trip-filter__item" 
  for="filter-${name}">${name}</label>`;
