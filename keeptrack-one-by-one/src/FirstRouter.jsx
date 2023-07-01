import {
    BrowserRouter,
    NavLink,
    Link,
    Routes,
    Route,
    useParams,
} from "react-router-dom";
import "./index.css";

class Movie {
    constructor(id, name, description, type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}

const movies = [
    new Movie(
        1,
        ' Titanic',
        'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        'Drama'
    ),
    new Movie(
        2,
        ' E.T. the Extra-Terrestrial',
        'A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.',
        'Fantasy'
    ),
    new Movie(
        3,
        'The Wizard of Oz',
        // tslint:disable-next-line:max-line-length
        'Dorothy Gale is swept away from a farm in Kansas to a magical land of Oz in a tornado and embarks on a quest with her new friends to see the Wizard who can help her return home in Kansas and help her friends as well.',
        'Fantasy'
    ),
    new Movie(
        4,
        'Star Wars: Episode IV - A New Hope ',
        // tslint:disable-next-line:max-line-length
        'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire/`s world-destroying battle-station while also attempting to rescue Princess Leia from the evil Darth Vader.',
        'Action'
    ),
];

function MovieDetail() {
    let { id } = useParams();
    id = Number(id);
    const movie = movies.find((movie) => movie.id === id);

    return (
        <div>
            <h3>{movie.name}</h3>
            <p>{movie.description}</p>
        </div>
    );
};

function MovieList({ movies }) {
    return (
        <div>
            <h2>Movies</h2>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <Link to={`./${movie.id}`}>{movie.name}</Link>
                    </li>
                ))}
            </ul>
            <div style={{marginLeft: "40px"}}>
                <Routes>
                    <Route path=":id" element={<MovieDetail />} />
                </Routes>
            </div>
        </div>
    );
};

function NotFound() {
    return (
        <>
            <h2>Uh oh.</h2>
            <p>
                The page you requested could not be found. Is there any chance you
                were looking for one of these?
            </p>
        </>
    );
}

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Contact() {
    return <h2>Contact</h2>;
}

export default function FirstRouter() {
    return (
        <BrowserRouter>
            <div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/about">About</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact">Contact</NavLink>
                        </li>
                        <li>
                            <NavLink to="/movies">Movies</NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="movies/*" element={<MovieList movies={movies} />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
