const apiRoot = "/api";

class UserInfo {
    /** @type{number} */id
    /** @type{string} */name
    /** @type{string} */email
    /** @type{string?} */bio
    /** @type{string?} */disp_email
    /** @type{string?} */disp_phone_number
    /** @type{boolean} */organizer
    /** @type{boolean} */admin
    /** @type{number} */picture
    /** @type{number} */banner
}

class UpdateUserInfo{
    /** @type{string?} */name
    /** @type{string?} */bio
    /** @type{string?} */disp_email
    /** @type{string?} */disp_phone_number
}

class ChangeUserAuth{
    /** @type{string} */old_email
    /** @type{string} */old_password
    /** @type{string?} */new_email
    /** @type{string?} */new_password
}

class Log {
    /** @type{string} */level_s
    /** @type{number} */level_i
    /** @type{string} */message
    /** @type{number} */millis
    /** @type{number} */sequenceNumber
    /** @type{string} */sourceClassName
    /** @type{string} */sourceMethodName
    /** @type{string} */thrown
}


class OrganizerEventTag {
    /** @type{string} */tag
}

class EventTicket {
    /** @type{number} */id
    /** @type{number} */event_id
    /** @type{string} */name
    /** @type{number} */price
    /** @type{number} */available_tickets
}

class OrganizerEvent {
    /** @type{number} */id
    /** @type{number} */owner_id
    /** @type{string} */name
    /** @type{string} */description
    /** @type{string} */type
    /** @type{string} */category
    /** @type{number} */picture
    /** @type{object} */metadata
    /** @type{boolean} */draft

    /** @type{number} */available_total_tickets

    /** @type{string} */location_name
    /** @type{number} */location_lat
    /** @type{number} */location_long
}

class AllOrganizerEvent{
    /** @type{OrganizerEvent} */ event
    /** @type{OrganizerEventTag[]} */ tags
    
}

class UpdateOrganizerEvent{
    /** @type{number} */id
    /** @type{string} */name
    /** @type{string} */description
    /** @type{object?} */metadata

    /** @type{number?} */start
    /** @type{number?} */duration

    /** @type{string?} */type
    /** @type{string?} */category
    
    /** @type{number?} */available_total_tickets

    /** @type{string?} */location_name
    /** @type{number?} */location_lat
    /** @type{number?} */location_long
}

class RouteStat{
    /** @type{number} */total_response_time_ns
    /** @type{number} */requests_handled
    /** @type{Object.<number, number>} */code_breakdown
}

class DbStat{
    /** @type{number} */rw_statements_executed
    /** @type{number} */ro_statements_executed
    
    /** @type{number} */rw_prepared_statements_executed
    /** @type{number} */ro_prepared_statements_executed

    /** @type{number} */rw_db_acquires
    /** @type{number} */ro_db_acquires

    /** @type{number} */rw_db_releases
    /** @type{number} */ro_db_releases

    /** @type{number} */rw_db_lock_waited
    /** @type{number} */ro_db_lock_waited

    /** @type{number} */rw_db_lock_waited_ns
    /** @type{number} */ro_db_lock_waited_ns

    /** @type{number} */rw_db_lock_held_ns
    /** @type{number} */ro_db_lock_held_ns
}

class DbStats{
    /** @type{Object.<string, DbStat>} */individual
    /** @type{DbStat} */global
}

class ServerStatistics{
    /** @type{Object.<string, RouteStat>} */route_stats
    /** @type{number} */total_requests_handled

    /** @type{DbStats} */db_stats

    /** @type{number} */curr_time_ms
    /** @type{number} */max_mem
    /** @type{number} */total_mem
    /** @type{number} */free_mem
}

class Search{
    /** @type{number?} */ date_start
    /** @type{number?} */ date_end
    /** @type{number?} */ max_duration
    /** @type{number?} */ min_duration
    /** @type{OrganizerEventTag[]?} */ tags
    /** @type{string} */type_fuzzy
    /** @type{string} */category_fuzzy
    /** @type{string?} */ organizer_fuzzy
    /** @type{string?} */ name_fuzzy
    /** @type{number?} */ organizer_exact
    /** @type{number?} */ distance
    /** @type{number?} */ location_lat
    /** @type{number?} */ location_long
    /** @type{boolean?} */ owning
    /** @type{boolean?} */ draft
    /** @type{string?} */ location
    /** @type{number?} */ offset
    /** @type{number?} */ limit
}

// actually just a string but shhhh
/** @type{string} */
class Session { }

const api = {
    /**
     * @param {string} route 
     * @param {RequestInit} data 
     * @param {string} error 
     * @returns {Promise<Response>}
     */
    api_call: async function (route, data, error) {
        var response;
        try {
            response = await fetch(`${apiRoot}${route}`, data);
        } catch (e) {
            console.log(e);
            throw { error, code: -1 };
        }

        if (response.ok) {
            return response;
        } else if (response.status >= 400 && response.status < 500) {
            throw { error: await response.text(), code: response.status };
        } else {
            throw { error, code: response.status };
        }
    },

    tickets: {
        /**
         * @param {number} ticket_id 
         * @param {Session} session 
         * @returns {Promise<integer>}
         */
        create_ticket: async function(event_id, session = cookies.getSession()){
            return await (await api.api_call(
                `/create_ticket/${event_id}`,
                {
                    method: 'POST',
                    headers: {
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while creating ticket"
            )).json();
        },
        /**
         * @param {EventTicket} ticket 
         * @param {Session} session 
         * @returns {Promise}
         */
        update_ticket: async function(ticket, session = cookies.getSession()){
            await api.api_call(
                `/update_ticket`,
                {
                    method: 'POST',
                    headers: {
                        'X-UserAPIToken': session
                    },
                    body: JSON.stringify(ticket),
                },
                "An error occured while updating ticket"
            )
        },
        /**
         * @param {number} ticket_id 
         * @param {Session} session 
         * @returns {Promise}
         */
        delete_ticket: async function(ticket_id, session = cookies.getSession()){
            await api.api_call(
                `/delete_ticket/${ticket_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while deleting ticket"
            )
        },
        /**
         * @param {number} event_id 
         * @param {Session} session 
         * @returns {Promise<EventTicket[]>}
         */
        get_tickets: async function(event_id, session = cookies.getSession()){
            return await (await api.api_call(
                `/get_tickets/${event_id}`,
                {
                    method: 'GET',
                    headers: {
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while getting tickets"
            )).json();
        },
    },

    admin: {
        /**
         * @param {string} sql 
         * @param {Session} session 
         * @returns {Promise<string>}
         */
        execute_sql: async function (sql, session = cookies.getSession()) {
            return await (await api.api_call(
                `/execute_sql`,
                {
                    method: 'POST',
                    headers: {
                        'X-UserAPIToken': session
                    },
                    body: sql,
                },
                "An error occured while executing sql"
            )).text();
        },

        /**
         * @param {Session} session 
         * @returns {Promise<Log[]>}
         */
        get_server_logs: async function (session = cookies.getSession()) {
            return await (await api.api_call(
                `/get_server_logs`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while getting the server logs"
            )).json();
        },
        
        /**
         * @param {Session} session 
         * @returns {Promise<ServerStatistics>}
         */
        get_server_statistics: async function(session = cookies.getSession()) {
            return await (await api.api_call(
                `/get_server_statistics`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while getting the route statistics"
            )).json();
        },
        
        /**
         * @param {string} email 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        delete_other_account: async function(email, session = cookies.getSession()) {
            await api.api_call(
                `/delete_other_account/${encodeURI(email)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while deleting that account"
            )
        },

        /**
         * @param {boolean} admin 
         * @param {string} email 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        set_account_admin: async function(admin, email, session = cookies.getSession()) {
            await api.api_call(
                `/set_account_admin/${encodeURI(admin)}/${encodeURI(email)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while setting that account as admin"
            )
        },

        /**
         * @param {string} level 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        set_log_level: async function(level, session = cookies.getSession()) {
            await api.api_call(
                `/set_log_level/${encodeURI(level)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while setting the log level"
            )
        },

        /**
         * @param {Session} session 
         * @returns {Promise<string>}
         */
        get_log_level: async function(session = cookies.getSession()) {
            return await (await api.api_call(
                `/get_log_level`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while getting the log level"
            )).text();
        },

        /**
         * @param {Session} session 
         * @returns {Promise<string[]>}
         */
        get_log_levels: async function(session = cookies.getSession()) {
            return await (await api.api_call(
                `/get_log_levels`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                },
                "An error occured while getting the log levels"
            )).json();
        }
    },

    events: {
        /**
         * @param {Session} session 
         * @returns {Promise<number>}
         */
        create_event: async function (session = cookies.getSession()) {
            return await (await api.api_call(
                '/create_event',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while creating event"
            )).json();
        },

        /**
         * @param {number|string} id 
         * @param {Session?} session 
         * @returns {Promise<AllOrganizerEvent>}
         */
        get_event: async function(id, session = cookies.getSession()){
            return await (await api.api_call(
                `/get_event/${encodeURI(id)}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while getting event"
            )).json();
        },

        /**
         * @param {UpdateOrganizerEvent} update 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        update_event: async function(update, session = cookies.getSession()){
            await api.api_call(
                '/update_event',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                    body: JSON.stringify(update),
                },
                "An error occured while updating event"
            );
        },

        /**
         * @param {number|string} id 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        delete_event: async function(id, session = cookies.getSession()){
            await api.api_call(
                `/delete_event/${encodeURI(id)}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while deleting event"
            );
        },

        /**
         * @param {number|string} id 
         * @param {string} tag 
         * @param {boolean} category 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        add_event_tag: async function(id, tag, category, session = cookies.getSession()){
            await api.api_call(
                `/add_event_tag/${encodeURI(id)}/${encodeURI(tag)}/${encodeURI(category)}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while adding event tag"
            );
        },

        /**
         * @param {number|string} id 
         * @param {string} tag 
         * @param {boolean} category 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        delete_event_tag: async function(id, tag, category, session = cookies.getSession()){
            await api.api_call(
                `/delete_event_tag/${encodeURI(id)}/${encodeURI(tag)}/${encodeURI(category)}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while deleting event tag"
            );
        },

        /**
         * @param {number|string} id 
         * @param {boolean} draft 
         * @param {Session} session 
         * @returns {Promise<>}
         */
        set_draft: async function(id, draft, session = cookies.getSession()){
            await api.api_call(
                `/set_draft/${encodeURI(id)}/${encodeURI(draft)}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while setting event draft"
            );
        },

        /**
         * @param {number|string} id 
         * @param {Blob} data 
         * @param {Session} session 
         * @returns {Promise<number>}
         */
        set_picture: async function(id, data, session = cookies.getSession()){
            return await (await api.api_call(
                `/set_picture/${encodeURI(id)}/`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                    body: data,
                },
                "An error occured while setting event picture"
            )).json();
        }
    },


    search: {
        /**
         * @param {Search} search 
         * @param {Session} session 
         * @returns {Promise<AllOrganizerEvent[]>}
         */
        search_events: async function(search, session = cookies.getSession()){
            return await (await api.api_call(
                '/search_events',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                    body: JSON.stringify(search),
                },
                "An error occured while searching"
            )).json();
        }
    },

    organizer: {
        /**
         * @param {Session} session 
         * @returns {Promise<>}
         */
        convert_to_organizer_account: async function (session = cookies.getSession()) {
            await api.api_call(
                '/convert_to_organizer_account',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while converting account to organizer"
            );
        },


        /**
         * @param {Search} search 
         * @returns {Promise<AllOrganizerEvent[]>}
         */
        get_drafts: async function (session = cookies.getSession()) {
            return await api.search.search_events({draft: true}, session = cookies.getSession())
        },

        /**
         * @param {Search} search 
         * @returns {Promise<AllOrganizerEvent[]>}
         */
        get_events: async function (session = cookies.getSession()) {
            return await api.search.search_events({draft: false, owning: true}, session = cookies.getSession())
        }
    },

    user: {
        /**
         * @param {number} id
         * @param {Session} session 
         * @returns {Promise<UserInfo>}
         */
        userinfo: async function (id, session = cookies.getSession()) {
            if(id==undefined||id==null)
                id=""
            const result = await (await api.api_call(
                `/userinfo/${id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    }
                },
                "An error occured while fetching userinfo"
            )).json();
            return result;
        },
        /**
         * @param {UpdateUserInfo} update
         * @param {Session} session 
         * @returns {Promise<UserInfo>}
         */
        update_user: async function (update, session = cookies.getSession()) {
            await api.api_call(
                `/update_user`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                    body: JSON.stringify(update)
                },
                "An error occured while updating user info"
            )
        },

        /**
         * @param {ChangeUserAuth} update
         * @param {Session} session 
         * @returns {Promise<>}
         */
        change_auth: async function (update, session = cookies.getSession()) {
            await api.api_call(
                `/change_auth`,
                {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-UserAPIToken': session
                    },
                    body: JSON.stringify(update)
                },
                "An error occured while updating the user auth"
            );
        },

        /**
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise<Session>}
         */
        login: async function (email, password) {
            return await (await api.api_call(
                `/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                },
                "An error occured while loggin in"
            )).text();
        },

        /**
         * @param {string} name 
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise}
         */
        register: async function (name, email, password) {
            await api.api_call(
                `/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                },
                "An error occured while registering"
            );
        },

        /**
         * @param {Session} session 
         * @returns {Promise<Session[]>}
         */
        list_sessions: async function (session = cookies.getSession()) {
            return await (await api.api_call(
                `/list_sessions`,
                {
                    method: 'GET',
                    headers: { 'X-UserAPIToken': session }
                },
                "An error occured while fetching sessions"
            )).json();
        },

        /**
         * @param {number|string} sessionId 
         * @param {Session} session 
         * @returns {Promise}
         */
        invalidate_session: async function (sessionId, session = cookies.getSession()) {
            await api.api_call(
                `/invalidate_session/${sessionId}`,
                {
                    method: 'DELETE',
                    headers: { 'X-UserAPIToken': session }
                },
                "An error occured while invalidating session"
            );
        },

        /**
         * @param {string} email 
         * @param {string} password 
         * @param {Session} session 
         * @returns {Promise}
         */
        delete_account: async function (email, password, session = cookies.getSession()) {
            await api.api_call(
                `/delete_account`,
                {
                    method: 'DELETE',
                    headers: { 'X-UserAPIToken': session },
                    body: JSON.stringify({ email, password })
                },
                "An error occured while invalidating session"
            );
        },
    },
}


const cookies = {
    secure_flag: function (){
        if (location.protocol === 'https:') {
            return "Secure";
        }else{
            return "";
        }
    }(),
    /**
     * 
     * @param {string} token 
     * @param {number} days
     */
    setSession: function (token, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `sessionToken=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;${cookies.secure_flag}`;
    },

    /**
     * @returns {Session}
     */
    getSession: function () {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === 'sessionToken') {
                return decodeURIComponent(value);
            }
        }
        return "";
    },

    deleteSessionToken: function () {
        document.cookie = `sessionToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;${cookies.secure_flag}`;
    },
}

const utility = {
    logout: function () {
        cookies.deleteSessionToken();
        window.location.href = '/account/login';
    },
    /**
     * @param {number|string} id 
     * @returns {boolean}
     */
    is_session_id_current: function (id) {
        if (cookies.getSession() == null || cookies.getSession().length == 0) return false;
        const curr_id = cookies.getSession().substring(cookies.getSession().length - 8, cookies.getSession().length);
        return parseInt(curr_id, 16) == id;
    },
    /**
     * @param {string} session 
     * @returns {number|null}
     */
    get_id_from_session: function (session = cookies.getSession()) {
        if (session == null || session.length == 0) return null;
        const curr_id = session.substring(session.length - 8, session.length);
        return parseInt(curr_id, 16);
    },
    is_logged_in: function() {
        return cookies.getSession() != null && cookies.getSession().length > 0;
    },
    require_logged_in: function () {
        if (!this.is_logged_in()) {
            window.location.href = "/account/login";
        }
    }

}


const page = {

    login: {
        /**
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise}
         */
        login: async function (email, password) {
            try {
                cookies.deleteSessionToken();
                cookies.setSession(await api.user.login(email, password));
                window.location.href = '/account';
            } catch ({ error, code }) {
                alert(error);
            }
        },
    },

    register: {
        /**
         * @param {string} name 
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise}
         */
        register: async function (name, email, password) {
            try {
                await api.user.register(name, email, password);
                window.location.href = '/account/login';
            } catch ({ error, code }) {
                alert(error);
            }
        },
    },

    account: {
        /**
         * @returns {Promise<UserInfo>}
         */
        userinfo: async function () {
            try {
                return await api.user.userinfo(null, cookies.getSession());
            } catch ({ error, code }) {
                if (code == 401) {
                    utility.logout();
                } else {
                    alert(error);
                }
            }
        },

        /**
         * @param {Element}
         * @param {number|string} id 
         * @returns {Promise}
         */
        remove_session: async function (element, id) {
            try {
                await api.user.invalidate_session(id, cookies.getSession());
                element.parentElement.outerHTML = "";
                if (utility.is_session_id_current(id)) {
                    utility.logout();
                }
            } catch (e) {
                alert(e);
            }
        },

        /**
         * @returns {Promise<Session[]>}
         */
        list_sessions: async function () {
            try {
                return await api.user.list_sessions(cookies.getSession());
            } catch ({ error, code }) {
                if (code == 401) {
                    utility.logout();
                } else {
                    alert(error);
                }
            }
        },

        /**
         * @param {number|string} sessionId 
         * @returns {Promise}
         */
        invalidate_session: async function (sessionId) {
            try {
                await api.user.invalidate_session(sessionId, cookies.getSession());
            } catch ({ error, code }) {
                if (code == 401) {
                    utility.logout();
                } else {
                    alert(error);
                }
            }
        },

        /**
         * @param {string} email 
         * @param {string} password 
         * @returns {Promise}
         */
        delete_account: async function (email, password) {
            try {
                await api.user.delete_account(email, password, cookies.getSession());
            } catch ({ error, code }) {
                if (code == 401) {
                    utility.logout();
                } else {
                    alert(error);
                }
            }
        },
    },


    awaiting_handlebar_templates: 0,
    awaiting_html_templates: 0,

    check_for_handlers: function () {
        if (this.awaiting_handlebar_templates == 0 && this.awaiting_html_templates == 0
            || this.awaiting_handlebar_templates == 0 && this.awaiting_html_templates == -1
            || this.awaiting_handlebar_templates == -1 && this.awaiting_html_templates == 0
        ) {
            document.dispatchEvent(new Event("dynamic_content_finished"));
        }
        if (this.awaiting_handlebar_templates == 0) {
            this.awaiting_handlebar_templates = -1;
            document.dispatchEvent(new Event("handlebar_templates_finished"))
        }
        if (this.awaiting_html_templates == 0) {
            this.awaiting_html_templates = -1;
            document.dispatchEvent(new Event("html_templates_finished"))
        }
    },

    /**
     * @param {Element} item 
     */
    load_dynamic_content: function (item) {
        if (item == null) return;
        for (let e of item.querySelectorAll("[type='text/x-html-template']")) {
            this.awaiting_html_templates++;
            (async _ => {
                try {
                    const result = await fetch(e.getAttribute("src"));
                    e.innerHTML = await result.text();
                } catch (err) {
                    e.innerHTML = JSON.stringify(err);
                }
                nodeScriptReplace(e);

                page.initialize_content(e.nextElementSibling);
                page.load_dynamic_content(e.nextElementSibling);
                this.awaiting_html_templates--;
                page.check_for_handlers();
            })();
        }
        for (let e of item.querySelectorAll("script[type='text/x-handlebars-template']")) {
            this.awaiting_handlebar_templates++;
            (async _ => {
                try {
                    if(e.hasAttributes("src")){
                        const result = await eval(e.getAttribute("src"));
                        var template = Handlebars.compile(e.innerHTML);
                        var html = template(result);
                        e.nextElementSibling.innerHTML = html;
                    }
                } catch (err) {
                    console.log(e);
                    console.log(err);
                    e.nextElementSibling.innerHTML = "ERROR: " + JSON.stringify(err, 2, null);
                }

                page.initialize_content(e.nextElementSibling);
                page.load_dynamic_content(e.nextElementSibling);
                this.awaiting_handlebar_templates--;
                page.check_for_handlers();
            })();
        }
        page.check_for_handlers();
    },

    /**
     * @param {Element} item 
     */
    initialize_content: (item) => {
        if (item == null) return;
        for (let e of item.querySelectorAll("template[type='text/x-handlebars-template']")) {
            try {
                var template = Handlebars.compile(e.innerHTML);
                var html = template({});
                e.nextElementSibling.innerHTML = html;
            } catch (err) {
                e.nextElementSibling.innerHTML = JSON.stringify(err);
            }
        }

        for (let e of item.querySelectorAll("div[onclick]")) {
            e.addEventListener("click", ev => {
                eval(e.getAttribute("onclick"));
            })
        }
    }
};

function nodeScriptReplace(node) {
    if(node.tagName === 'SCRIPT'){
        node.parentNode.replaceChild(nodeScriptClone(node) , node);
    }else{
        var i = -1;
        var children = node.childNodes;
        while(++i < children.length){
            nodeScriptReplace(children[i]);
        }
    }

    return node;
}
function nodeScriptClone(node){
    var script  = document.createElement("script");
    script.text = node.innerHTML;

    var i = -1;
    var attrs = node.attributes, attr;
    while( ++i < attrs.length ) {                                    
        script.setAttribute((attr = attrs[i]).name, attr.value);
    }
    return script;
}


document.addEventListener('handlebar_templates_finished', () => {
    console.log("Handlebar templates finished loading");
});

document.addEventListener('html_templates_finished', () => {
    console.log("HTML templates finished loading");
});

document.addEventListener('dynamic_content_finished', () => {
    console.log("Dynamic content finished loading");
    document.body.style = "";
});


document.addEventListener('DOMContentLoaded', () => {
    document.body.style = "display:none";
    if (typeof Handlebars !== 'undefined') {
        Handlebars.registerHelper("raw-helper", function (options) {
            return options.fn();
        });
        Handlebars.registerHelper('formatTime', function(millis) {
            const date = new Date(millis);
            return date.toLocaleString();
        });
        Handlebars.registerHelper('logColor', function(level) {
            const colors = { "SEVERE": "red", "WARNING": "yellow", "INFO": "blue", "CONFIG": "grey" };
            return colors[level] || "grey";
        });
        Handlebars.registerHelper('eq', function(a, b) {
            return (a === b);
        });
        Handlebars.registerHelper('gt', function(a, b) {
            return (a > b);
        });
        Handlebars.registerHelper('gte', function(a, b) {
            return (a >= b);
        });
        Handlebars.registerHelper('lt', function(a, b) {
            return (a < b);
        });
        Handlebars.registerHelper('lte', function(a, b) {
            return (a <= b);
        });
        Handlebars.registerHelper('ne', function(a, b) {
            return (a !== b);
        });
        
    }

    page.initialize_content(document);
    page.load_dynamic_content(document);
});

function gen_qr(data, size=150){
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=`+encodeURI(data);
}