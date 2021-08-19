declare const RadioBrowser: {
    service_url: string;

    /**
     * get a radio-browser host
     */
    getRandomHost(): string;
    
    /**
     * returns a list of category.
     * https://de1.api.radio-browser.info/#List_of_countries
     * https://de1.api.radio-browser.info/#List_of_countrycodes
     * https://de1.api.radio-browser.info/#List_of_codecs
     * https://de1.api.radio-browser.info/#List_of_languages
     * https://de1.api.radio-browser.info/#List_of_states
     * https://de1.api.radio-browser.info/#List_of_tags
     */
    getCategory<T extends radioBrowser.Categories>(category: T, filter?: Partial<radioBrowser.CategoryFilter>): Promise<radioBrowser.Category<T>[]>;
    
    /**
     * List of radio stations
     * https://de1.api.radio-browser.info/#List_of_radio_stations
     * https://de1.api.radio-browser.info/#Search_radio_stations_by_url
     * https://de1.api.radio-browser.info/#Stations_by_clicks
     * https://de1.api.radio-browser.info/#Stations_by_votes
     * https://de1.api.radio-browser.info/#Stations_by_recent_click
     * https://de1.api.radio-browser.info/#Stations_by_recently_changed
     * https://de1.api.radio-browser.info/#Stations_that_got_deleted
     * https://de1.api.radio-browser.info/#Old_versions_of_stations
     * https://de1.api.radio-browser.info/#Stations_that_need_improvement
     * https://de1.api.radio-browser.info/#Broken_stations
     */
    getStations(filter?: Partial<radioBrowser.StationsFilter>): Promise<Partial<radioBrowser.StationStruct[]>>
    
    /**
     * Get a list of station check results
     * https://de1.api.radio-browser.info/#Get_a_list_of_station_check_results
     * 
     * @default seconds 0
     */
    getChecks(stationuuid: string, seconds?: number): Promise<Partial<radioBrowser.StationCheckStruct>>
    
    /**
     * List of station check steps
     * https://de1.api.radio-browser.info/#List_of_station_check_steps
     * 
     * @param {array} uuids array of station uuids
     */
    getChecksteps(uuids: (string|number)[]): Promise<Partial<radioBrowser.StationCheckStepStruct>>
    
    /**
     * List of station clicks
     * <https://de1.api.radio-browser.info/#List_of_station_clicks>
     * @default seconds 0
     */
    getClicks(stationuuid: string, seconds?: number): PromiseradioBrowser.StationClicks>
    
    /**
     * Station click counter
     * <https://de1.api.radio-browser.info/#Count_station_click>
     */
    clickStation(stationuuid: string): Promise<radioBrowser.StationCount>
    
    /**
     * Advanced Search Stations
     * https://de1.api.radio-browser.info/#Advanced_station_search
     */
    searchStations(params: Partial<radioBrowser.AdvancedStationParams>): Promise<Partial<radioBrowser.StationStruct>>
    
    /**
    * Vote for station
    * https://de1.api.radio-browser.info/#Vote_for_station
    */
    voteStation(stationuuid: number): Promise<radioBrowser.StationsVote>
    
    /**
     * delete a station by staionuuid
     * https://de1.api.radio-browser.info/#Delete_a_station
     */
    deleteStation(stationuuid: string): Promise<any>
    
    /**
     * Add radio station. 
     * https://de1.api.radio-browser.info/#Add_radio_station
     */
    addStation(params: radioBrowser.AddStationParams): Promise<StationAdd>
    
    /**
     * Server stats
     * https://de1.api.radio-browser.info/#Server_stats
     */
    getServerStats(): Promise<ServerStats>
    
    /**
     * Server mirrors
     * https://de1.api.radio-browser.info/#Server_mirrors
     */
    getServerMirrors(): Promise<ServerMirrors[]>

    /**
     * Server config
     * <https://de1.api.radio-browser.info/#Server_config>
     */
    getServerConfig(): Promise<ServerConfig>

    /**
     * list of types used in getStations({by: <string>})
     */
    readonly filter_by_types: string[]

    /**
     * list of categories using in getCategory({category}[, filter])
     */
    readonly category_types: string[]
};

declare namespace radioBrowser {
    export type Categories = 'countries'|'countrycodes'|'codecs'|'states'|'languages'|'tags'

    export interface CategoryFilter {
        /**
         * name of the attribute the result list will be sorted by
         * @default name
         */
        order: 'name' | 'stationcount';
        /**
         * reverse the result list if set to true
         * @default false
         */
        reverse: boolean;
        /**
         * do not count broken stations
         * @default false
         */
        hidebroken: boolean;
        /**
         * starting value of the result list from the database. For example, if you want to do paging on the server sid
         * @default 0
         */
        offset: string;
        /**
         * number of returned datarows (stations) starting with offset
         * @default 100000
         */
        limit: string;
        /**
         * OPTIONAL, filter states by country name
         * @default undefined
         */
        country: string
        searchterm: string;
    }

    export interface ListOfCountriesCrCountryCodesOrCodecsOrLanguagesOrTags {
        name: string;
        stationcount: string;
    }

    export interface ListOfStates {
        name: string;
        country: string;
        stationcount: string;
    }

    type Category<T> = 
        T extends 'countries' | 'countrycodes' | 'codecs' | 'languages' | 'tags' ? ListOfCountriesCrCountryCodesOrCodecsOrLanguagesOrTags :
        T extends 'states'  ? ListOfStates :
        never;

    /** @see https://de1.api.radio-browser.info/#Struct_station */
    export interface StationStruct {
        /** A globally unique identifier for the change of the station information */
        changeuuid: string;
        /** A globally unique identifier for the station */
        stationuuid: string;
        /** The name of the station */
        name: string;
        /** The stream URL provided by the user */
        url: string;
        /** An automatically "resolved" stream URL. Things resolved are playlists (M3U/PLS/ASX...), HTTP redirects (Code 301/302). This link is especially usefull if you use this API from a platform that is not able to do a resolve on its own (e.g. JavaScript in browser) or you just don't want to invest the time in decoding playlists yourself. */
        url_resolved: string;
        /** URL to the homepage of the stream, so you can direct the user to a page with more information about the stream. */
        homepage: string;
        /** URL to an icon or picture that represents the stream. (PNG, JPG) */
        favicon: string;
        /** Tags of the stream with more information about it */
        tags: string;
        /** 
         * full name of the country. Currently it is autogenerated from the countrycode.
         * @depreacted use countrycode instead
        */
        country: string;
        /** Official countrycodes as in {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 ISO 3166-1 alpha-2} */
        countrycode: string;
        /** Full name of the entity where the station is located inside the country */
        state: string;
        /** Languages that are spoken in this stream. */
        language: string;
        /** Languages that are spoken in this stream by code {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes ISO 639-2/B} */
        languagecodes: string;
        /** Number of votes for this station. This number is by server and only ever increases. It will never be reset to 0. */
        votes: number;
        /** Last time when the stream information was changed in the database */
        lastchangetime: string;
        /** Last time when the stream information was changed in the database */
        lastchangetime_iso8601: string;
        /** The codec of this stream recorded at the last check. */
        codec: string;
        /** The bitrate of this stream recorded at the last check. */
        bitrate: number;
        /** Mark if this stream is using HLS distribution or non-HLS. */
        hls: number;
        /** The current online/offline state of this stream. This is a value calculated from multiple measure points in the internet. The test servers are located in different countries. It is a majority vote. */
        lastcheckok: number;
        /** The last time when any radio-browser server checked the online state of this stream */
        lastchecktime: string;
        /** The last time when any radio-browser server checked the online state of this stream */
        lastchecktime_iso8601: string;
        /** The last time when the stream was checked for the online status with a positive result */
        lastcheckoktime: string;
        /** The last time when the stream was checked for the online status with a positive result */
        lastcheckoktime_iso8601: string;
        /** The last time when this server checked the online state and the metadata of this stream */
        lastlocalchecktime: string;
        /** The last time when this server checked the online state and the metadata of this stream */
        lastlocalchecktime_iso8601: string;
        /** The time of the last click recorded for this stream */
        clicktimestamp: string;
        /** The time of the last click recorded for this stream */
        clicktimestamp_iso8601?: null;
        /** Clicks within the last 24 hours */
        clickcount: number;
        /** The difference of the clickcounts within the last 2 days. Posivite values mean an increase, negative a decrease of clicks. */
        clicktrend: number;
        /** 0 means no error, 1 means that there was an ssl error while connecting to the stream url. +/
        ssl_error: number;
        /** Latitude on earth where the stream is located. */
        geo_lat: number;
        /** Longitude on earth where the stream is located. */
        geo_long: number;
    }

    export interface StationsFilter {
        /**
         * name of the attribute the result list will be sorted by
         * @default name
         */
        order: 'name' | 'url' | 'homepage' | 'favicon' | 'tags' | 'country' | 'state' | 'language' | 'votes' | 'codec' | 'bitrate' | 'lastcheckok' | 'lastchecktime' | 'clicktimestamp' | 'clickcount' | 'clicktrend' | 'random';
        by: 'uuid' | 'name' | 'nameexact' | 'codec' | 'codecexact' | 'country' | 'countryexact' | 'countrycodeexact' | 'state' | 'stateexact' | 'language' | 'languageexact' | 'tag' | 'tagexact' | 'url' | 'topclick' | 'topvote' | 'lastclick' | 'lastchange' | 'improvable' | 'broken';
        /** Radio Stations that match that Termn */
        searchterm: string;
        /**
         * reverse the result list if set to true
         * @default false
         */
        reverse: boolean;
        /**
         * starting value of the result list from the database. For example, if you want to do paging on the server side.
         * @default 0
         */
        offset: number;
        /**
         * number of returned datarows (stations) starting with offset
         * @default 100000
         */
        limit: number;
        /** MANDATORY, URL of the station */
        url: string;
    }

    /** @see https://de1.api.radio-browser.info/#Struct_station_check */
    export interface StationCheckStruct {
        stationuuid: string;
        checkuuid: string;
        source: string;
        codec: string;
        bitrate: number;
        hls: number;
        ok: number;
        timestamp: string;
        timestamp_iso8601: string;
        urlcache: string;
        metainfo_overrides_database: number;
        public?: null;
        name?: null;
        description?: null;
        tags?: null;
        countrycode?: null;
        countrysubdivisioncode?: null;
        homepage?: null;
        favicon?: null;
        loadbalancer?: null;
        server_software: string;
        sampling: number;
        timing_ms: number;
        languagecodes?: null;
        ssl_error: number;
        geo_lat: number;
        geo_long: number;
    }

    /** @see https://de1.api.radio-browser.info/#Struct_station_check_step */
    export interface StationCheckStepStruct {
        stepuuid: string;
        parent_stepuuid: string;
        checkuuid: string;
        stationuuid: string;
        url: string;
        urltype: string;
        error: string;
        creation_iso8601: string;
    }

    export interface StationClicks {
        stationuuid: string;
        clickuuid: string;
        clicktimestamp_iso8601: string;
        clicktimestamp: string;
    }

    export interface StationCount {
        ok: string;
        message: string;
        stationuuid: string;
        name: string;
        url: string;
    }

    export interface AdvancedStationParams {
        /** name of the station */
        name: string;
        /**
         * True: only exact matches, otherwise all matches.
         * @default false
         */
        nameExact: boolean;
        /** country of the station */
        country: string;
        /**
         * True: only exact matches, otherwise all matches.
         * @default false
         */
        countryExact: boolean;
        /** 2-digit countrycode of the station (see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 SO 3166-1 alpha-2}). */
        countrycode: string;
        /** state of the station */
        state: string;
        /**
         * True: only exact matches, otherwise all matches.
         * @default false
         */
        stateExact: boolean;
        /** language of the station */
        language: string;
        /**
         * True: only exact matches, otherwise all matches.
         * @default false
         */
        languageExact: boolean;
        /** a tag of the station */
        tag: string;
        /**
         * True: only exact matches, otherwise all matches.
         * @default false
         */
        tagExact: boolean;
        /** a comma-separated list of tag. It can also be an array of string in JSON HTTP POST parameters. All tags in list have to match. */
        tagList: string;
        /** codec of the station */
        codec: string;
        /**
         * minimum of kbps for bitrate field of stations in result
         * @default 0
         */
        bitrateMin: number;
        /**
         * maximum of kbps for bitrate field of stations in result
         * @default 1000000
         */
        bitrateMax: number;
        /** 
         * undefined=display all, true=show only stations with geo_info, false=show only stations without geo_info
         * @default both? probably undefined
         */
        has_geo_info: boolean | undefined;
        /**
         * name of the attribute the result list will be sorted by
         * @default name
         */
        order: 'name' | 'url' | 'homepage' | 'favicon' | 'tags' | 'country' | 'state' | 'language' | 'votes' | 'codec' | 'bitrate' | 'lastcheckok' | 'lastchecktime' | 'clicktimestamp' | 'clickcount' | 'clicktrend' | 'random';
        /**
         * reverse the result list if set to true
         * @default false
         */
        reverse: boolean;
        /**
         * starting value of the result list from the database. For example, if you want to do paging on the server side.
         * @default 0
         */
        offset: number;
        /**
         * number of returned datarows (stations) starting with offset
         * @default 100000
         */
        limit: number;
        /**
         * do list/not list broken stations
         * @default false
         */
        hidebroken: boolean;
    }

    export interface StationsVote {
        ok: boolean;
        message: string;
    }

    export interface AddStationParams {
        /**
         * the name of the radio station. Max 400 chars.
         * @example Station Name
         */
        name: string;
        /**
         * the URL of the station
         * @example http://this.is.an.url/stream.mp3
         */
        url: string;
        /**
         * the homepage URL of the station
         * @example http://this.is.an.url/
         */
        homepage?: string;
        /**
         * the URL of an image file (jpg or png)
         * @example http://this.is.an.url/favicon.ico
         */
        favicon?: string;
        /**
         * The 2 letter countrycode of the country where the radio station is located
         * @example AT
         */
        countrycode?: string;
        /**
         * The name of the part of the country where the station is located
         * @example Vienna
         */
        state?: string;
        /**
         * The main language used in spoken text parts of the radio station
         * @example English
         */
        language?: string;
        /**
         * A list of tags separated by commas to describe the station
         * @example pop,rock
         */
        tags?: string;
        /**
         * The latitude of the stream location. Nullable.
         * @example 12.3456
         */
        geo_lat?: string;
        /**
         * The longitude of the stream location. Nullable.
         * @example -12.3456
         */
        geo_long?: string;
    }

    export interface StationAdd {
        ok: boolean;
        message: string;
        uuid: string;
    }

    export interface ServerStats {
        supported_version: number;
        software_version: string;
        status: string;
        stations: number;
        stations_broken: number;
        tags: number;
        clicks_last_hour: number;
        clicks_last_day: number;
        languages: number;
        countries: number;
    }

    export interface ServerMirrors {
        ip: string;
        name: string;
    }

    export interface ServerConfig {
        check_enabled: boolean;
        prometheus_exporter_enabled: boolean;
        pull_servers?: (string)[] | null;
        tcp_timeout_seconds: number;
        broken_stations_never_working_timeout_seconds: number;
        broken_stations_timeout_seconds: number;
        checks_timeout_seconds: number;
        click_valid_timeout_seconds: number;
        clicks_timeout_seconds: number;
        mirror_pull_interval_seconds: number;
        update_caches_interval_seconds: number;
        server_name: string;
        server_location: string;
        server_country_code: string;
        check_retries: number;
        check_batchsize: number;
        check_pause_seconds: number;
        api_threads: number;
        cache_type: string;
        cache_ttl: number;
    }
}

export = RadioBrowser;