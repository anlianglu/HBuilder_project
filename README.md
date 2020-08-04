# HBuilder_project
项目创建
Introduction

What is wrong with security() function?
Repainting.
Delays.

In this segment I will talk about one of the hottest and most popular functions that is often misunderstood and not used to its full potential. I, myself have stayed away from it because of its complexity and how easy it is to introduce bugs into your script.

As an algorithmic trading developer, I value accuracy overall, so when using higher timeframe values on lower periods, I want to make sure they are represented 100% as on their original formats, and it turns out there are a multitude of ways of doing so, which raises the question which method works best. At first, it would make common sense there should only be one way, after all, we are trying to mimic one value so why should we need multiple variations of it? To make things worse, some of these methods repaint, but if you search around, you will find solutions and how to use them correctly.

Unfortunately, there is a hidden price to using a non-repainting security() function. It seems when you use it, you have to choose between repainting and delay. It really shocked me I didn’t find any information about adding lag as a side effect when choosing non-repainting methods so I decided to dig deeper into security() and share my findings and also my custom solution. My goal here is to bring this into the light and hopefully have the TradingView team fix it once and for all (the right way, no more intricateness or hidden prices.).





















Main Issue

There are two scenarios of repainting using security() for higher timeframe values, one is when “lookahead” is “true” and you are seeking the current value, the other when it is “false” and the value is based on real-time. There is no way to avoid the latter, but simply not using it or adding special conditions so it behaves differently when the data is real-time. The cleanest and current solution is using “lookahead = true” and the value from the previous bar (e.g., close[1]), for more on that you can check out this script.

Now have you noticed the difference between non-repainting method and the original function (e.g., “security("MSFT", "D", close)”)?

The original one gives us the value on the last bar before the higher timeframe candle exits. 

Example:

Original,  “dailyClose = security("XBTUSD", "1D", close)”.
Higher timeframe is “1D” and local timeframe is “1H”.
We should get the value of “1D” at 23:00 UTC (it should be noted exchanges don’t always share the same closing time which changes drastically from market to market).
When “barstate.ishistory” is “true”, “dailyClose” will continue to fluctuate for the duration of the last bar, in this case the final hour of the day.
When “barstate.isrealtime” is “true”, it will behave abnormally to the point when at 00:00 it will show the previous day value and then after a refresh it will fix itself back and show the value at 23:00 like on the other previous time intervals.

Solution, “security("XBTUSD", "1D", close[1], lookahead = true)”.
This removes all repainting but only prints out the value at 00:00.

How is 23:00 and 00:00 different? How much is our script affected because of this delay? I believe the answer is found in our original goal when we used “security(..., "1D", ...)”. If you jump to the “1D” chart you will get the “close” as soon as the bar finishes and our goal was to recreate this same step on the “1H”, but instead we got it one hour later.

Now, you probably thought, well, we get the daily “close” at 00:00, not one hour after, and that is correct, but with a catch. While we do get it at 00:00, it happens to be at the beginning of the first “1H” of the day, and for example, the backtest must wait until the bar is over before doing anything with this value, and so most of our operations, so technically we see the daily closing price at 01:00 or one hour after.

Custom Solution

I think once the issue becomes clear the solution also does. We need the original (e.g., “security("MSFT", "D", close)”) to simply not repaint and print its value locally on the bar before the higher timeframe ends, but this is something that must be done internally by TradingView, there are also other issues with the original method which I will discuss further. For now I will give you a custom solution which I consider quite beautiful. The idea is to get “X” value on the last bar without repainting.

There are two components that make up the solution.

First, we use repainting to our favor, I have personally done this concept before and needless to say is for advanced users (“security("XBTUSD", "1D", close, gaps = true, lookahead = true)”):
Notice we are not using the previous value while “lookahead = true”, so we are purposely creating a repainting scenario.
In this case “gaps = true”, the reason being is to show that while the value repaints it remains positioned on the first bar of the higher timeframe.

Second, our local timeframe remains “1H”, our repainting “1D” value shows at 01:00, and will stop repainting at 00:00 of the next cycle. For as long as we are aware of this, we can create a controlled environment, all we have to do is call the repainting “1D” value at 23:00, one hour before the end of the day. This way, at 23:00 our value will change and behave like the original security() method, but through this we can pass this value to our strategy or study and a signal will become processed, confirmed, and ready to take action upon at 00:00.

Below is the source code:

//@version=4
study("Daily Close Repainting Exploit Fix", overlay = true)

f_securityFinal(_when, _period, _source, _gaps) =>
    _raw = security(syminfo.tickerid, _period, _source, lookahead = true)
    var _return = _raw[1], _return := _when ? _raw : change(time(_period)) != 0 and not _when[1] ? _raw[1] : _gaps ? na : _return

f_timer(_h, _m) =>
    hour(time) == _h and minute(time) == _m

bool timer = f_timer(23, 00)
float sourceFix = f_securityFinal(timer, "1D", close, false)

plot(sourceFix, color = color.yellow, style = plot.style_linebr)
I will try to explain the code above while keeping it short as to not dilute our main topic.

var _return = _raw[1]
Security() processes many types of data, I couldn’t give the value of “na” without explicitly giving it a type. So in this case, “var” assigns value on the first bar so if you give it the previous value of bar before (which is “na”), it implicitly gives it to our variable.

_when ? _raw
Here we are telling it to take new value only at the time interval we want, in this case 23:00.

change(time(_period)) != 0 and not _when[1] ? _raw[1]
While testing I noticed the downside to this solution, which is, sometimes a bar can be skipped, and if the one connected to our time interval is, then we miss passing the data on time, like we wanted originally, when this takes place, we have no choice but to take the delayed data.

hour(time) == _h and minute(time) == _m
Some pairs close at even hours while securities like stocks close at XX:30 intervals.
This is where it gets tricky tho, when calling “1D” timeframe on lower ones, we only need one bar per day and it is typically the last one so it is easy to find, but other periods will require multiple “timer” conditions.























Other Issues

Other issues I noticed with security original method are:
On the first 00:00 of the chart it gives us a value which corresponds to the previous higher timeframe bar, because it happens at 00:00 it is the issue where we need wait to before the local bar is finished and hence it is pointless, not to mention because it is first bar of the chart, our other local data haven’t yet form.
Let’s say you use “3D” as a higher timeframe while still locally on the “1H”, security() will start giving the data 3 days after the first 00:00, instead of following the actual “3D” time interval or dates the data is from.
On certain securities like “stocks” the original security() won’t give the data at the last bar like in other pairs, instead it will always do it the next day, this is where the custom formula above also comes handy.





























Conclusion

Thank you for making this far, I hope this brings new light into one of the most powerful TradingView functions.

With everything going on in the world, it is times like these, when we truly understand for a change we need to be united. So please share, support, and together let’s start a revolution.


In the meantime you have my insight into how to get around it. I expect this article to be outdated very soon which could only mean it served its purpose.
