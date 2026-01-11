% Knowledge base for Jetwing Travels - sample facts and rules

% sample tours: tour(Id, Name, Category, PriceRange, Duration, BestSeason, PopularityScore).
% priceRange: budget | mid | luxury
% duration: weekend | week | extended
% travelStyle: leisure | adventure | family

tour(t1, "Colombo City Tour", [city,history], mid, weekend, any, 65).
tour(t2, "Galle & Beaches", [beach,history], mid, weekend, dry, 80).
tour(t3, "Horton Plains Trek", [adventure,nature], budget, day, dry, 70).
tour(t4, "Luxury Cultural Circuit", [culture,luxury], luxury, week, any, 50).
tour(t5, "Beach Paradise Tour", [beach,relaxation], mid, week, dry, 75).
tour(t6, "Wildlife Adventure", [wildlife,adventure], mid, week, dry, 80).
tour(t7, "Hill Country Escape", [nature,culture], mid, weekend, any, 70).
tour(t8, "Ancient Heritage Tour", [culture,history], mid, week, dry, 65).

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

% Help request
response(Input, _, "I can help you with tours, recommendations, and travel information. What would you like to know?", "User asking for help, providing overview of capabilities.") :- 
  sub_string(Input, _, _, _, "help").

% Destination queries
response(Input, _, "Sri Lanka has amazing destinations! Popular ones include Colombo, Kandy, Galle, and Yala. What type of destination interests you?", "User asking about destinations, providing overview and asking for preferences.") :- 
  sub_string(Input, _, _, _, "destination").

% Accommodation queries
response(Input, _, "We have various accommodation options from budget guesthouses to luxury resorts. What is your preferred location and budget?", "User asking about accommodation, gathering preferences for recommendations.") :- 
  sub_string(Input, _, _, _, "accommodation").

% Weather queries
response(Input, _, "Sri Lanka has dry season (Dec-Mar) and rainy season (Apr-Nov). What time of year are you planning to visit?", "User asking about weather, providing seasonal overview.") :- 
  sub_string(Input, _, _, _, "weather").

% Sinhala greetings
response(Input, _, "ආයුබෝවන්! මම ශ්‍රී ලංකාවේ සංචාලන සහායකයෙක්. ඔබට කෙසේ සහාය විය හැකිද?", "Sinhala greeting detected, responding in Sinhala.") :- 
  sub_string(Input, _, _, _, "ආයුබෝවන්").

response(Input, _, "හෙලෝ! ශ්‍රී ලංකාවේ ගමනින් සම්බන්ධ කාර්යයන්හිදී ඔබට සහාය වීමට මම සූදානම්. ඔබට කුමක් දැන ගැනීමට අවශ්‍යයි?", "Sinhala hello detected, responding in Sinhala.") :- 
  sub_string(Input, _, _, _, "හෙලෝ").

% Sinhala destination queries
response(Input, _, "ශ්‍රී ලංකාවේ රසවත් ගමනාන්තයන් තියෙනවා! කෝළඹ, මහනුවර, ගාල්ල සහ යාලා වැනි ස්ථාන ප්‍රසිද්ධයි. ඔබට කුමන වර්ගයේ ගමනාන්තයක් උනන්දරයි?", "Sinhala destination query, responding in Sinhala.") :- 
  sub_string(Input, _, _, _, "ගමනාන්තය").

% Best time to visit
response(Input, _, "Sri Lanka වෙත පැමිණීමට හොඳම කාලය වන්නේ උතුරු දකුණු මෝසම වලින් තොරවා ගත් දකුණු දකුණු මෝසම (දෙසැම්බර් සිට මාර්තු දක්වා). මෙම කාලයේදී බාහිර ක්‍රියාකාරකම්, වනෝත්පත්ති සෆරි සහ වෙරළු නිවාස සඳහා වඩාත් සුදුසු වේ.", "Query about best time to visit, providing seasonal information.") :- 
  sub_string(Input, _, _, _, "best time").

% Currency
response(Input, _, "ශ්‍රී ලංකාවේ මුදල් ඒකකය වන්නේ ශ්‍රී ලංකා රුපියල් (LKR). සංචාලක ප්‍රාන්තයන්හි ඇමරිකානු ඩොලර් සහ යුරෝ භාවිතා කළ හැක. නගරයන්හි ඇටීඑම් තියෙන අතර, රැඳවීම් ස්ථාන සහ ආහාර ස්ථාන වල ක්‍රෙඩිට් කාඩ් පත්‍ර පිළිගත්තේය.", "Currency query, providing information in Sinhala.") :- 
  sub_string(Input, _, _, _, "මුදල්").

% Food
response(Input, _, "ශ්‍රී ලංකා ආහාර විශේෂයන්ට රයිස් සහ කරි, නැවුම් මාළු, පළතුරු සහ ලූණු අදාළ වේ. අත්හදා බලන යුතු ආහාර වලට හොපර්ස්, ස්ට්‍රින් රොටි සහ කොට්ටු රොටි ඇතුළත් වේ. එසේම රාජ කොකෝනට් වතුර ද ප්‍රසිද්ධයි!", "Food query, providing cuisine information in Sinhala.") :- 
  sub_string(Input, _, _, _, "ආහාර").
