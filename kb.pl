% Knowledge base for Jetwing Travels - sample facts and rules

% sample tours: tour(Id, Name, Category, PriceRange, Duration, BestSeason, PopularityScore).
% priceRange: budget | mid | luxury
% duration: weekend | week | extended
% travelStyle: leisure | adventure | family

tour(t1, "Colombo City Tour", [city,history], mid, weekend, any, 65).
tour(t2, "Galle & Beaches", [beach,history], mid, weekend, dry, 80).
tour(t3, "Horton Plains Trek", [adventure,nature], budget, day, dry, 70).
tour(t4, "Luxury Cultural Circuit", [culture,luxury], luxury, week, any, 50).

% Simple rules
suitable_for_budget(TourId, UserBudget) :- tour(TourId, _, _, UserBudget, _, _, _).
suitable_for_budget(TourId, UserBudget) :- tour(TourId, _, _, Price, _, _, _), Price = mid, UserBudget = budget, fail.

% Travel style match
matches_style(TourId, Style) :- tour(TourId, _, Categories, _, _, _, _), member(Style, Categories).

% Recommend if popularity > 60 and matches season or any
recommend(TourId, UserBudget, UserSeason) :-
    tour(TourId, _, _, Price, _, BestSeason, Popularity),
    Popularity > 60,
    (BestSeason = UserSeason; BestSeason = any; UserSeason = any),
    (Price = UserBudget; (UserBudget = mid, Price = budget); (UserBudget = mid, Price = luxury)).

% Booking constraints example
% allowed_age(TourId, Age) - example: luxury circuit requires age >= 12
allowed_age(t4, Age) :- Age >= 12.
allowed_age(_, _).

% Example ancestor-style rule for tracing reasons (for demonstration)
reason(TourId, "popular and season match") :- recommend(TourId, mid, dry).

% Chatbot responses with context awareness and explanations
% response(Input, LastIntent, Reply, Explanation)
% LastIntent tracks the previous conversation state for follow-up questions

% Greeting responses - always available regardless of context
response(Input, _, "Hello! How can I assist you with your travel plans?", "Basic greeting detected in user input, providing welcoming response.") :- 
  sub_string(Input, _, _, _, "hello").

response(Input, _, "Hi there! What can I help you with today?", "Casual greeting detected, responding in friendly manner.") :- 
  sub_string(Input, _, _, _, "hi").

% Tours intent - initial query
response(Input, _, "What type of tour are you interested in?", "User mentioned tours, asking for specific type to provide targeted recommendations.") :- 
  sub_string(Input, _, _, _, "tour").

% Follow-up for tours - beach type
response(Input, "tours", "We have beach tours in Bali and Maldives. Would you like budget or luxury?", "Previous intent was tours, user specified beach preference, providing specific beach tour options.") :- 
  sub_string(Input, _, _, _, "beach").

% Follow-up for tours - mountain type  
response(Input, "tours", "We have mountain tours in Switzerland and Nepal. What is your budget?", "Previous intent was tours, user specified mountain preference, asking for budget to refine recommendations.") :- 
  sub_string(Input, _, _, _, "mountain").

% Recommendations intent
response(Input, _, "I can recommend tours based on your preferences. What is your budget and preferred season?", "User asked for recommendations, gathering preferences for personalized suggestions.") :- 
  sub_string(Input, _, _, _, "recommend").

% Goodbye
response(Input, _, "Goodbye! Have a great trip!", "User ending conversation, providing farewell message.") :- 
  sub_string(Input, _, _, _, "bye").

% Thanks
response(Input, _, "You're welcome!", "User expressing gratitude, responding politely.") :- 
  sub_string(Input, _, _, _, "thank").
