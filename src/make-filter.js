export default (name, checked = false) => `<input 
  type="radio" 
  id="filter-${name}" 
  name="filter" 
  value="${name}" 
  ${checked ? `checked` : ``}>
          
  <label class="trip-filter__item" 
  for="filter-${name}">${name}</label>`;
