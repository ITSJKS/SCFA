def FindSqrt(x):
    start = 0
    end = x

    ans = x
    while start <= end:
        mid = (start + end)//2
        midsquare = mid * mid
        midprev = (mid-1) * (mid-1)

        if midsquare == x:
            return mid
        
        if midsquare > x and midprev < x:
            return mid-1

        if midsquare < x:
            start = mid + 1
        
        if midsquare > x:
            end = mid - 1
    return ans