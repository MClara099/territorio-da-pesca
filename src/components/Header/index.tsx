import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import LangFileProps from '../../json/language/interface';

import getLanguageFile, { langOptions } from '../../util/getLanguageFile';

import ptBrLang from '../../json/language/pt-br';

export interface LangProps {
    type: "Lang",
    name: string,
    endName?: string;
    param: string,
    json: LangFileProps
}

export interface LangGroupProps {
    type: "Group",
    name: string;
    options: LangProps[]
}

interface HeaderProps {
    language: string;
    onChangeLanguage: (json: LangFileProps) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onChangeLanguage }) => {
    const [lang, setLang] = useState<LangProps>({
        type: "Lang",
        name: "Brasil",
        endName: "Português - Brasil",
        param: "pt-br",
        json: ptBrLang
    });

    const history = useHistory();
    const path = history.location.pathname.split('/');

    useEffect(() => {
        const value = getLanguageFile(language);
        setLang(value);

        onChangeLanguage(value.json);
    }, [language]);

    return(
        <header id="header" className="fixed-top">
            <div className="container d-flex align-items-center">
            <h1 className="logo mr-auto"><Link to="index.html">Presento<span>.</span></Link></h1>
            <nav className="nav-menu d-none d-lg-block">
                <ul>
                    { lang.json.header.map(function(item, index){
                        return(
                            <li key={index} className={item.route === history.location.pathname? "active":""}>
                                <Link to={item.route}>
                                    {item.name}
                                </Link>
                            </li>
                        );
                    }) }
                    <li className="drop-down"><Link to={history.location.pathname}>{lang.endName? lang.endName:lang.name}</Link>
                        <ul>
                            { langOptions.map(function(item, index){
                                if(item.type === "Lang"){
                                    const value = getLanguageFile(item.param);

                                    let newRoute = `/${value.param}`;
                                    for(let x = 2; x < path.length; x++){
                                        newRoute = newRoute + "/" + path[x] 
                                    }

                                    return(
                                        <li key={index}>
                                            <Link 
                                                to={newRoute} 
                                                onClick={() => { setLang(value) }}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                }else{
                                    const value = getLanguageFile(item.options[0].param);

                                    let newRoute = `/${value.param}`;
                                    for(let x = 2; x < path.length; x++){
                                        newRoute = newRoute + "/" + path[x] 
                                    }
                                    
                                    return(
                                        <li key={index} className="drop-down"><Link to={newRoute}>{item.name}</Link>
                                            <ul>
                                                { item.options.map(function(item, index){
                                                    const value = getLanguageFile(item.param);

                                                    let newRoute = `/${value.param}`;
                                                    for(let x = 2; x < path.length; x++){
                                                        newRoute = newRoute + "/" + path[x] 
                                                    }

                                                    return(
                                                        <li key={index}>
                                                            <Link 
                                                                to={newRoute}
                                                                onClick={() => { setLang(value) }}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    );
                                                }) }
                                            </ul>
                                        </li>
                                    );
                                }
                            }) }
                        </ul>
                    </li>
                </ul>
            </nav>
                <Link to="#about" className="get-started-btn scrollto">{lang.json.headerMapButtonName}</Link>
            </div>
        </header>
    );
}

export default Header;