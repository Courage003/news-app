import React, { useEffect, useState } from 'react';
import Newitems from './Newitems';
import Spinner from './Spinner';
import { useLocation } from 'react-router-dom';

const SearchResults = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories] = useState(['Sports', 'Technology', 'Business', 'Entertainment', 'Science', 'Politics', 'General']); // Predefined categories

    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q');

    // Handle category selection
    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategories(prevState =>
            prevState.includes(category)
                ? prevState.filter(cat => cat !== category) // Uncheck, remove category
                : [...prevState, category] // Add category to selectedCategories
        );
    };

    // Update the news results based on selected categories and search query
    const updateNews = async () => {
        try {
            props.setProgress(10);
            let categoriesQuery = selectedCategories.join(',');
            let url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(searchQuery)}${
                categoriesQuery ? `&category=${categoriesQuery}` : ''
            }&apiKey=a5b42d148b934c609f259034b800e11f`;
            setLoading(true);
            let data = await fetch(url);
            props.setProgress(40);
    
            if (!data.ok) {
                throw new Error(`HTTP error! status: ${data.status}`);
            }
    
            let parsedData = await data.json();
            props.setProgress(70);
    
            // Ensure articles exist in the parsedData
            if (parsedData.articles && Array.isArray(parsedData.articles)) {
                setArticles(parsedData.articles);
            } else {
                setArticles([]); // Set to empty array if no articles are found
            }
    
            setLoading(false);
            props.setProgress(100);
        } catch (error) {
            console.error("Error fetching news:", error);
            setArticles([]); // Handle any errors by showing no articles
            setLoading(false);
        }
    };
    
    // Update news when search query or selected categories change
    useEffect(() => {
        document.title = `NewsReaderApp - Search Results for "${searchQuery}"`;
        updateNews();
        // eslint-disable-next-line
    }, [searchQuery, selectedCategories]);

    return (
        <>
            <h1 className={`text-center ${props.mode === 'dark' ? 'text-white' : 'text-black'}`} style={{ margin: '30px', marginTop: '90px' }}>
                {`NewsReaderApp - Search Results for "${searchQuery}"`}
            </h1>
            <div className="container">
                <div className="row mb-3">
                    <div className="col">
                        <h4>Filter by Categories</h4>
                        {categories.map((category) => (
                            <div key={category} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={category}
                                    id={`category-${category}`}
                                    onChange={handleCategoryChange}
                                    checked={selectedCategories.includes(category)}
                                />
                                <label className="form-check-label" htmlFor={`category-${category}`}>
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading && articles.length === 0 && (
                    <div className="text-center mt-5">
                        <h3>No Result Found</h3>
                    </div>
                )}
                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return (
                                <div className="col-md-4" key={element.url}>
                                    <Newitems
                                        title={element.title ? element.title : ''}
                                        mode={props.mode}
                                        description={element.description ? element.description : ''}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchResults;
