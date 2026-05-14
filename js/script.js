(function($) {

    "use strict";

    $(document).ready(function() {
      // Register Swiper modules
      Swiper.use([Swiper.Mousewheel]);

      function formatCurrency(value) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value);
      }

      function readNumber(selector, fallback) {
        var value = parseFloat($(selector).val());
        return Number.isFinite(value) && value >= 0 ? value : fallback;
      }

      var costSwiper = new Swiper(".cost-swiper", {
        spaceBetween: 18,
        pagination: {
            el: ".cost-swiper-pagination",
            clickable: true,
          },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          992: {
            slidesPerView: 1.15,
          }
        },
        mousewheel: true,
        grabCursor: true,
      });

      function buildYearSlides(years, baseMonthly, feeMonthly, annualIncrease) {
        var slideMarkup = "";
        var cumulative = 0;

        for (var year = 1; year <= years; year += 1) {
          var growthFactor = Math.pow(1 + annualIncrease, year - 1);
          var adjustedBase = baseMonthly * growthFactor;
          var adjustedFees = feeMonthly * growthFactor;
          var monthlyTotal = adjustedBase + adjustedFees;
          var annualTotal = monthlyTotal * 12;
          cumulative += annualTotal;

          slideMarkup += '<div class="swiper-slide">';
          slideMarkup += '<article class="year-card">';
          slideMarkup += '<div class="year-pill">Year ' + year + '</div>';
          slideMarkup += '<h4>' + formatCurrency(annualTotal) + '</h4>';
          slideMarkup += '<p>Monthly total: ' + formatCurrency(monthlyTotal) + '</p>';
          slideMarkup += '<ul class="year-breakdown">';
          slideMarkup += '<li>Base subscription: ' + formatCurrency(adjustedBase) + ' per month</li>';
          slideMarkup += '<li>Hidden fees: ' + formatCurrency(adjustedFees) + ' per month</li>';
          slideMarkup += '<li>Cumulative total: ' + formatCurrency(cumulative) + '</li>';
          slideMarkup += '</ul>';
          slideMarkup += '</article>';
          slideMarkup += '</div>';
        }

        $("#yearSlides").html(slideMarkup);
        costSwiper.update();
      }

      function updateSummary() {
        var basePrice = readNumber("#subscriptionPrice", 0);
        var hiddenFees = readNumber("#hiddenFees", 0);
        var annualIncreasePercent = readNumber("#inflationRate", 0);
        var years = Math.max(1, Math.round(readNumber("#durationYears", 1)));
        var annualIncrease = annualIncreasePercent / 100;

        var monthlyTotal = basePrice + hiddenFees;
        var yearOneTotal = monthlyTotal * 12;
        var lifetimeTotal = 0;

        for (var year = 1; year <= years; year += 1) {
          var growthFactor = Math.pow(1 + annualIncrease, year - 1);
          var yearlyMonthly = (basePrice + hiddenFees) * growthFactor;
          lifetimeTotal += yearlyMonthly * 12;
        }

        $("#monthlyTotal, #heroMonthly").text(formatCurrency(monthlyTotal));
        $("#yearOneTotal, #heroYearOne").text(formatCurrency(yearOneTotal));
        $("#lifetimeTotal, #heroLifetime").text(formatCurrency(lifetimeTotal));

        var baseSpan = Math.max(basePrice, 1);
        var feeShare = hiddenFees / baseSpan;
        var inflationShare = annualIncreasePercent / 20;

        $("#baseBar").css("width", "100%");
        $("#feeBar").css("width", Math.min(100, 25 + feeShare * 60) + "%");
        $("#inflationBar").css("width", Math.min(100, 20 + inflationShare * 80) + "%");

        buildYearSlides(years, basePrice, hiddenFees, annualIncrease);
      }

      $("#subscriptionPrice, #hiddenFees, #inflationRate, #durationYears").on("input change", updateSummary);
      updateSummary();

      var subscriptions = [
        { name: "Spotify", cost: 11.99 },
        { name: "Netflix", cost: 15.49 },
        { name: "Hulu", cost: 7.99 },
        { name: "Disney+", cost: 7.99 },
        { name: "Apple Music", cost: 10.99 },
        { name: "Amazon Prime", cost: 14.99 },
        { name: "HBO Max", cost: 9.99 },
        { name: "DoorDash Pass", cost: 9.99 },
        { name: "Uber Pass", cost: 9.99 },
        { name: "Gym Membership", cost: 50 },
        { name: "Phone Plan", cost: 75 },
        { name: "Internet", cost: 65 },
        { name: "Adobe CC", cost: 54.99 },
        { name: "Dropbox Plus", cost: 11.99 },
        { name: "iCloud+", cost: 9.99 },
        { name: "YouTube Premium", cost: 13.99 },
        { name: "Paramount+", cost: 5.99 },
        { name: "Audible", cost: 14.95 }
      ];

      function spawnCostPopup() {
        var layer = $("#mainPopupLayer");
        if (!layer.length) return;

        var layerWidth = window.innerWidth;
        var layerHeight = window.innerHeight;
        var popup = $("<div class='cost-popup'></div>");
        
        var subscription = subscriptions[Math.floor(Math.random() * subscriptions.length)];
        var popupTop = Math.random() * Math.max(layerHeight - 90, 0);
        var popupLeft = Math.random() * Math.max(layerWidth - 140, 0);
        var popupHue = Math.floor(Math.random() * 40) + 330;
        var popupScale = 0.9 + Math.random() * 0.45;

        popup.html("<div style='font-size: 0.8rem; opacity: 0.8;'>" + subscription.name + "</div><div>-$" + subscription.cost.toFixed(2) + "</div>");
        popup.css({
          top: popupTop + "px",
          left: popupLeft + "px",
          color: "hsl(" + popupHue + ", 95%, 66%)",
          transform: "scale(" + popupScale + ") rotate(" + (Math.random() * 10 - 5) + "deg)",
          textAlign: "center",
          lineHeight: "1.2"
        });

        layer.append(popup);

        window.setTimeout(function() {
          popup.addClass("is-visible");
        }, 20);

        window.setTimeout(function() {
          popup.removeClass("is-visible").addClass("is-leaving");
        }, 1500);

        window.setTimeout(function() {
          popup.remove();
        }, 2300);
      }

      spawnCostPopup();
      window.setInterval(spawnCostPopup, 8000);

      // Money pile disappearing animation on hidden costs tab
      function initMoneyPile() {
        var moneyPile = $("#moneyPile");
        if (moneyPile.length === 0) return;
        
        moneyPile.html("");
        var totalBills = 50;
        for (var i = 0; i < totalBills; i++) {
          var bill = $("<div class='money-bill'></div>");
          moneyPile.append(bill);
        }

        var visibleBills = totalBills;
        var interval = setInterval(function() {
          if (visibleBills > 0) {
            var billToRemove = Math.floor(Math.random() * visibleBills);
            $(".money-bill").eq(billToRemove).fadeOut(400, function() {
              $(this).remove();
            });
            visibleBills--;
          } else {
            clearInterval(interval);
            setTimeout(initMoneyPile, 2000);
          }
        }, 300);
      }

      // Initialize money pile when hidden tab is shown
      $('#hidden-tab').on('shown.bs.tab', function() {
        initMoneyPile();
      });

    }); // End of a document ready

})(jQuery);