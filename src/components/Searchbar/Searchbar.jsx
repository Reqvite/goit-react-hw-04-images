import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import { Header, FormContainer, SearchButton,ButtonLabel, Input } from "./Searchbar.styled"

import {  toast } from 'react-toastify';


export const Searchbar = ({ newQuery, onSubmit}) => { 
  const [query, setQuery] = useState('');

  const handleNameChange = e => {
    setQuery(e.currentTarget.value.toLowerCase().trim())
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    if (query === '') {
       toast('The field must not be empty, please enter something.');
       return;
    }
    if (query === newQuery) {
      toast('Enter something new..');
       return;
    }
    onSubmit(query);
    setQuery('');
    e.currentTarget.reset();
  }

      return (
    <Header >
    <FormContainer onSubmit={handleSubmit}>     
     <SearchButton type="submit" >
      <AiOutlineSearch size={32}/>
    <ButtonLabel>Search</ButtonLabel>
    </SearchButton>
    <Input
      type="text"
      autoComplete="off"
      autoFocus
      name="query"
      placeholder="Search images and photos"
      onChange={handleNameChange}         
        />
    </FormContainer>  
</Header>
    )
}  
    
    
