% Tau Prolog Knowledge Base for Sri Lankan Tourism Chatbot
% This file contains facts and rules for destinations, accommodations, tours, and travel information

% =============================================================================
% DESTINATIONS
% destination(Id, Name, Category, Description, Location, BestSeason, Popularity)
% =============================================================================

destination(sigiriya, 'Sigiriya Rock Fortress', cultural, 'Ancient rock fortress with frescoes and gardens, UNESCO World Heritage Site', 'Central Province', dry, 95).
destination(polonnaruwa, 'Polonnaruwa Ancient City', cultural, 'Medieval capital with temples and statues', 'North Central Province', dry, 85).
destination(ella, 'Ella', hill_country, 'Scenic hill station with waterfalls and tea plantations', 'Uva Province', any, 90).
destination(nuwara_eliya, 'Nuwara Eliya', hill_country, 'Cool climate hill station known as Little England', 'Central Province', any, 88).
destination(yala, 'Yala National Park', wildlife, 'Famous for leopards and wildlife safaris', 'Southern Province', dry, 92).
destination(galle, 'Galle Fort', cultural, 'Colonial fort and UNESCO site with Dutch architecture', 'Southern Province', any, 87).
destination(kandy, 'Kandy', cultural, 'Sacred city with Temple of the Tooth and cultural shows', 'Central Province', any, 89).
destination(colombo, 'Colombo', city, 'Capital city with modern attractions and colonial history', 'Western Province', any, 86).
destination(mirissa, 'Mirissa', beach, 'Beautiful beach town famous for whale watching', 'Southern Province', dry, 84).
destination(arugam_bay, 'Arugam Bay', beach, 'Surfing paradise with pristine beaches', 'Eastern Province', dry, 83).

% =============================================================================
% ACCOMMODATIONS
% accommodation(Id, Name, Type, Location, PriceRange, Rating, Amenities)
% PriceRange: budget | mid | luxury
% =============================================================================

accommodation(jetwing_yala, 'Jetwing Yala', resort, yala, luxury, 5, [pool, spa, wildlife_view]).
accommodation(cinnamon_grand_colombo, 'Cinnamon Grand Colombo', hotel, colombo, luxury, 5, [pool, spa, city_view]).
accommodation(ella_gap, 'Ella Gap', guesthouse, ella, mid, 4, [garden, mountain_view]).
accommodation(sigiriya_village, 'Sigiriya Village', resort, sigiriya, luxury, 5, [pool, cultural_view]).
accommodation(mirissa_beach, 'Mirissa Beach Resort', resort, mirissa, mid, 4, [beach_access, pool]).
accommodation(kandy_house, 'Kandy Heritage House', boutique_hotel, kandy, mid, 4, [cultural_experience]).
accommodation(nuwara_eliya_grand, 'Nuwara Eliya Grand Hotel', hotel, nuwara_eliya, luxury, 5, [tea_plantation_view]).
accommodation(galle_fort_hotel, 'Galle Fort Hotel', boutique_hotel, galle, luxury, 5, [ocean_view, historic]).
accommodation(arugam_bay_resort, 'Arugam Bay Beach Resort', resort, arugam_bay, mid, 4, [surf_school, beach_access]).
accommodation(polonnaruwa_rest_house, 'Polonnaruwa Rest House', guesthouse, polonnaruwa, budget, 3, [cultural_access]).

% =============================================================================
% TOUR PACKAGES
% tour_package(Id, Name, Duration, Destinations, PriceRange, Highlights, BestSeason)
% Duration: day | weekend | week | extended
% =============================================================================

tour_package(cultural_triangle, 'Cultural Triangle Tour', week, [sigiriya, polonnaruwa, kandy], mid, ['Ancient ruins', 'Temple visits', 'Cultural shows'], dry).
tour_package(hill_country_escape, 'Hill Country Escape', weekend, [ella, nuwara_eliya], mid, ['Tea plantations', 'Waterfalls', 'Scenic trains'], any).
tour_package(wildlife_safari, 'Wildlife Safari Adventure', week, [yala, udawalawe], mid, ['Leopard spotting', 'Elephant herds', 'Bird watching'], dry).
tour_package(beach_hopping, 'Southern Beach Hopping', week, [mirissa, galle, tangalle], mid, ['Whale watching', 'Surfing', 'Beach relaxation'], dry).
tour_package(complete_sri_lanka, 'Complete Sri Lanka Tour', extended, [colombo, sigiriya, kandy, ella, yala, galle], luxury, ['All major attractions', 'Luxury accommodations', 'Private transport'], dry).

% =============================================================================
% TRAVEL INFORMATION
% weather(Season, Description, BestActivities)
% visa_info(Type, Requirements, ProcessingTime)
% =============================================================================

weather(dry, 'December to March - Warm and dry', ['Cultural sites', 'Wildlife safaris', 'Beach activities']).
weather(rainy, 'April to November - Monsoon season', ['Hill country', 'Tea plantations', 'Indoor activities']).

visa_info(eta, 'Electronic Travel Authorization for 30 days', '24 hours').
visa_info(visa_on_arrival, 'Available for certain nationalities', 'Immediate').

% =============================================================================
% INTENT RECOGNITION
% intent_keywords(Intent, Keywords)
% =============================================================================

intent_keywords(destination, ['destination', 'place', 'visit', 'see', 'explore', 'where']).
intent_keywords(accommodation, ['hotel', 'stay', 'accommodation', 'resort', 'guesthouse', 'lodge']).
intent_keywords(tour, ['tour', 'package', 'itinerary', 'trip', 'travel', 'holiday']).
intent_keywords(weather, ['weather', 'season', 'when', 'best time', 'rain', 'dry']).
intent_keywords(visa, ['visa', 'entry', 'requirements', 'passport']).
intent_keywords(booking, ['book', 'reserve', 'price', 'cost', 'how much']).

% =============================================================================
% RECOMMENDATION RULES
% =============================================================================

% Recommend destinations by category
recommend_destination(Category, Destination) :-
    destination(Destination, _, Category, _, _, _, Popularity),
    Popularity > 80.

% Recommend accommodations by location and budget
recommend_accommodation(Location, Budget, Accommodation) :-
    accommodation(Accommodation, _, _, Location, Budget, Rating, _),
    Rating >= 4.

% Recommend tours by duration and season
recommend_tour(Duration, Season, Tour) :-
    tour_package(Tour, _, Duration, _, _, _, BestSeason),
    (BestSeason = Season ; BestSeason = any ; Season = any).

% =============================================================================
% NATURAL LANGUAGE PROCESSING HELPERS
% =============================================================================

% Check if input contains keywords for an intent
contains_keywords(Input, Intent) :-
    intent_keywords(Intent, Keywords),
    member(Keyword, Keywords),
    sub_string(Input, _, _, _, Keyword).

% Extract location from input (simplified)
extract_location(Input, Location) :-
    destination(Location, _, _, _, _, _, _),
    sub_string(Input, _, _, _, Location).

% Extract budget preference
extract_budget(Input, Budget) :-
    (sub_string(Input, _, _, _, 'budget') ; sub_string(Input, _, _, _, 'cheap')),
    Budget = budget.
extract_budget(Input, Budget) :-
    (sub_string(Input, _, _, _, 'luxury') ; sub_string(Input, _, _, _, 'expensive')),
    Budget = luxury.
extract_budget(_, mid).

% =============================================================================
% RESPONSE GENERATION RULES
% =============================================================================

% Generate destination response
generate_destination_response(Category, Response) :-
    findall(Dest, recommend_destination(Category, Dest), Destinations),
    Destinations \= [],
    format_response_destinations(Destinations, Response).

% Generate accommodation response
generate_accommodation_response(Location, Budget, Response) :-
    findall(Acc, recommend_accommodation(Location, Budget, Acc), Accommodations),
    Accommodations \= [],
    format_response_accommodations(Accommodations, Response).

% Generate tour response
generate_tour_response(Duration, Season, Response) :-
    findall(Tour, recommend_tour(Duration, Season, Tour), Tours),
    Tours \= [],
    format_response_tours(Tours, Response).

% =============================================================================
% FORMATTING HELPERS
% =============================================================================

format_response_destinations([], '').
format_response_destinations([Dest|Rest], Response) :-
    destination(Dest, Name, Category, Desc, Location, _, _),
    format_response_destinations(Rest, RestResponse),
    format(string(Response), '• ~w (~w): ~w in ~w~n~w', [Name, Category, Desc, Location, RestResponse]).

format_response_accommodations([], '').
format_response_accommodations([Acc|Rest], Response) :-
    accommodation(Acc, Name, Type, _, PriceRange, Rating, _),
    format_response_accommodations(Rest, RestResponse),
    format(string(Response), '• ~w (~w, ~w stars, ~w range)~n~w', [Name, Type, Rating, PriceRange, RestResponse]).

format_response_tours([], '').
format_response_tours([Tour|Rest], Response) :-
    tour_package(Tour, Name, Duration, _, PriceRange, Highlights, _),
    format_response_tours(Rest, RestResponse),
    format(string(Response), '• ~w (~w days, ~w range): ~w~n~w', [Name, Duration, PriceRange, Highlights, RestResponse]).

% =============================================================================
% MAIN CHATBOT RESPONSE RULE
% response(Input, Response, Explanation)
% =============================================================================

response(Input, Response, 'Greeting and introduction') :-
    (sub_string(Input, _, _, _, 'hello') ; sub_string(Input, _, _, _, 'hi') ; sub_string(Input, _, _, _, 'hey')),
    Response = 'Hello! I\'m your Sri Lankan tourism assistant. I can help you with destinations, accommodations, tour packages, and travel information. What would you like to know?'.

response(Input, Response, 'Destination recommendation') :-
    contains_keywords(Input, destination),
    extract_location(Input, Location),
    generate_destination_response(Location, DestResponse),
    DestResponse \= '',
    format(string(Response), 'Based on your interest in ~w, here are some recommended destinations:~n~w', [Location, DestResponse]).

response(Input, Response, 'Accommodation search') :-
    contains_keywords(Input, accommodation),
    extract_location(Input, Location),
    extract_budget(Input, Budget),
    generate_accommodation_response(Location, Budget, AccResponse),
    AccResponse \= '',
    format(string(Response), 'Here are some accommodation options in ~w for ~w budget:~n~w', [Location, Budget, AccResponse]).

response(Input, Response, 'Tour package recommendation') :-
    contains_keywords(Input, tour),
    (sub_string(Input, _, _, _, 'week') -> Duration = week ; Duration = weekend),
    generate_tour_response(Duration, any, TourResponse),
    TourResponse \= '',
    format(string(Response), 'Here are some tour packages for ~w trips:~n~w', [Duration, TourResponse]).

response(Input, Response, 'Weather information') :-
    contains_keywords(Input, weather),
    weather(dry, DryDesc, DryActivities),
    weather(rainy, RainyDesc, RainyActivities),
    format(string(Response), 'Sri Lanka has two main seasons:~n• Dry season: ~w~n  Best for: ~w~n• Rainy season: ~w~n  Best for: ~w', [DryDesc, DryActivities, RainyDesc, RainyActivities]).

response(Input, Response, 'Visa information') :-
    contains_keywords(Input, visa),
    visa_info(eta, ETADesc, ETATime),
    visa_info(visa_on_arrival, VOADesc, VOATime),
    format(string(Response), 'Visa options for Sri Lanka:~n• ETA: ~w (Processing: ~w)~n• Visa on Arrival: ~w (Processing: ~w)', [ETADesc, ETATime, VOADesc, VOATime]).

response(Input, Response, 'Fallback response') :-
    Response = 'I\'m sorry, I didn\'t understand that. I can help you with Sri Lankan destinations, accommodations, tour packages, weather information, and visa requirements. Please try rephrasing your question!'.