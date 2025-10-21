const FloridaResourceSection = () => {
  return (
    <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Florida home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Box */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm rounded-xl shadow-large p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Your Florida Real Estate Resource!
          </h2>
          
          <div className="space-y-6 text-foreground">
            <p className="text-lg leading-relaxed">
              Unlock the door to your future dream home or condo in Florida with FloridaHomeFinder.com! Our website is the ultimate guide to real estate across Florida, covering all major metro areas from Tampa & St. Petersburg, Sarasota & Naples, Orlando, & South East Florida from Port St Lucie all the way down to Key West. FloridaHomeFinder.com is dedicated to helping all home buyers and sellers make informed decisions about their buying and selling needs so you can sell your home for maximum profit or buy the house of your dreams. Our user-friendly MLS tools and extensive listing database makes finding your next home a breeze, while our free market analysis and comprehensive seller services will help you get top dollar on your home!
            </p>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Find a Florida REALTOR® Near Me
              </h3>
              <p className="text-lg leading-relaxed">
                When you&apos;re looking to sell a home in Florida, you can count on Florida Home Finder & The Mandel Team agents to provide top-notch service when listing your home. Ready to sell? Find your city below or get a free market analysis on your home now!
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Florida Community Guides
              </h3>
              <p className="text-lg leading-relaxed">
                Use our Florida community guides to help guide you in your search for the best places to live in Florida.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Updated Florida Real Estate Listings Daily
              </h3>
              <p className="text-lg leading-relaxed">
                We know that finding the perfect home can be overwhelming, but our massive directory of Florida MLS listings makes it easy! Available homes for sale on FloridaHomeFinder.com are updated every 15 minutes, so you can always find the most up-to-date listings in your area.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Learn All About Florida
              </h3>
              <p className="text-lg leading-relaxed">
                Every region of Florida is a little different and they all offer something unique! Our Florida Real Estate Blog will keep you up-to-date on all things related to real estate in Florida and help you figure out which area is best for you! With our goal of providing real estate information for those looking to buy or sell property available within our area, we want to arm you with all the information you need to make your home search successful. Whether you are trying to find information on Florida or learning about real estate or mortgage information, our Florida real estate blog has you covered, including Florida Moving Guides and even information on the best places to live in and popular things to do in each area of Florida.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Florida Home Search Tools
              </h3>
              <p className="text-lg leading-relaxed">
                Be the first to know about new homes for sale in your desired location before anyone else! Register today for our Florida Property Tracker to receive email notifications and instant alerts whenever a home matches what YOU are looking for. The Property Tracker is the best way to stay up-to-date on the newest homes for sale in Florida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloridaResourceSection;
