import React, { useEffect, useState } from 'react'
import Newitems from './Newitems'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

    const capitalize = (word) => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const updateNews = async () => {
        props.setProgress(10);
        // Use environment variable for the API key
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(40);
        let parsedData = await data.json();
        props.setProgress(70);
        
        // Check if parsedData contains articles and totalResults
        if (parsedData.articles && parsedData.totalResults) {
            setArticles(parsedData.articles);
            setTotalResults(parsedData.totalResults);
        }
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `NewsReaderApp - ${capitalize(props.category)}`;
        updateNews();
        // eslint-disable-next-line
    }, []);

    const fetchMoreData = async () => {
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        
        // Ensure parsedData.articles exists before concatenating
        if (parsedData.articles) {
            setArticles(articles.concat(parsedData.articles));
            setTotalResults(parsedData.totalResults);
        }
    };

    return (
        <>
            <h1 className={`text-center ${props.mode === 'dark' ? 'text-white' : 'text-black'}`} style={{ margin: '30px', marginTop: '90px' }}>
                {`NewsReaderApp - Top ${capitalize(props.category)} Headlines`}
            </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles ? articles.length : 0}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return (
                                <div className="col-md-4" key={element.url}>
                                    <Newitems
                                        title={element.title ? element.title : ""}
                                        mode={props.mode}
                                        description={element.description ? element.description : ""}
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
            </InfiniteScroll>
        </>
    );
};

News.defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'general'
};

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    mode: PropTypes.string,
    setProgress: PropTypes.func.isRequired
};

export default News;
