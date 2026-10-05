# Celestial PostHog Dashboard

## Filters and Reporting Rules

Use `site_name = celestial` on every insight and funnel step. Also restrict `$current_url` to the actual deployed website origin, including a trailing slash, to avoid localhost and other environments. Replace the placeholder below before using the prompt. If multiple production origins are intentional, allowlist each one.

Celestial does not emit a custom `environment` property. Location events reuse anonymous visitor identity but do not explicitly attach `$session_id`, so use unique visitors for sharing insights and related funnels.

Approximate GeoIP (`$geoip_*`) and consented location fields (`city`, `country`, `region`) have different sources and coverage. Visitors who share are only a subset of visitors. Keep missing locations visible; do not add GeoIP counts and consented-location counts together as a total audience.

## Dashboard Prompt

Paste into PostHog AI, or use this as a manual setup checklist:

```text
Create a dashboard named "Celestial - Traffic and Visitor Geography".
Use the PostHog project configured for this website.

Apply event-property filters site_name = celestial and
$current_url starts with <YOUR_CELESTIAL_PRODUCTION_ORIGIN_WITH_TRAILING_SLASH>
to every insight and every funnel step.
Replace that placeholder with the actual deployed origin.
There is no environment property in this implementation.

Use the last 30 days, daily intervals, and compare with the previous 30 days
where supported. Use event properties rather than identified-person properties.

Create these insights:
1. Traffic: total $pageview events, unique visitors by distinct_id, sessions
   by distinct $session_id on SDK pageview events, and daily visitor trends.
2. Page popularity: $pageview counts and unique visitors by $pathname.
   Include /, /birthday, /moon, /shuffle, /solar-system, /pets,
   /cosmic-age, /build-your-planet, and /gravity-playground.
3. Acquisition: unique $pageview visitors by $referring_domain and utm_source,
   with utm_medium and utm_campaign available as additional breakdowns.
4. Audience: unique $pageview visitors by $device_type, $browser, and $os.
5. Approximate geography: unique $pageview visitors by $geoip_country_name,
   $geoip_subdivision_1_name, and $geoip_city_name. Label these as approximate
   IP-based location and retain unknown/missing locations.
6. Discovery navigation: ordered visitor funnels from $pageview with
   $pathname = / to $pageview for each discovery path. Use a one-day window
   and label these as page navigation, not successful tool completion.
7. Interaction overview: $autocapture events broken down by available
   interaction/element properties. Only use properties that actually exist.
8. Optional location sharing: visitor_location_shared total events, unique
   sharing visitors, and a daily trend. Count unique visitors separately
   because repeat shares can create multiple events.
9. Consented geography: visitor_location_shared unique visitors by country,
   region, city, and locality. These are custom properties, not $geoip_*.
   Include geocoding_status and do not treat sharers as the entire audience.
10. Geocoding coverage: visitor_location_shared counts by geocoding_status
    (resolved, city_unavailable, failed), with unknown or empty place fields
    visible. A failed lookup can still include a consented location snapshot.
11. Reported location accuracy: distribution or median of accuracy_meters
    for visitor_location_shared. Label it browser-reported accuracy in meters.
12. Sharing funnel: $pageview -> visitor_location_shared, using unique visitors
    and a one-day conversion window. This measures visitors who submitted a
    location, not the percentage who granted permission after seeing a prompt,
    because prompt-view and permission-decision events are not implemented.

Keep approximate GeoIP and consented location insights separate.
Keep session recording disabled.
Do not create metrics from nonexistent custom events such as
birthday_lookup_succeeded, planet_selected, image_downloaded, or
location_permission_denied. Do not require environment or $session_id on the
manually submitted location event.
If required events/properties are missing, list them for a real-site check;
do not invent data or substitute events from another website.
```

## Limits

Pageview and click analytics do not confirm a NASA lookup, rendered result, file save, or another tool outcome. Optional-location submission is recorded only after a sharing action; prompt views, dismissals, permission denial, and reverse-geocoding failures are not emitted as separate custom events. Geocoding status is included on accepted location events instead.

Country/city estimates from IP can be inaccurate or missing, especially on VPNs and mobile networks. Browser location can also have a wide reported accuracy radius. An HTTP acknowledgement and dashboard availability are separate stages.

## References

- [PostHog dashboard documentation](https://posthog.com/docs/product-analytics/dashboards)
- [PostHog GeoIP properties](https://posthog.com/docs/libraries/go#overriding-geoip-properties)
