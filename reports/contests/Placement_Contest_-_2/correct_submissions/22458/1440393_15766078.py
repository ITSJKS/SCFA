def FindSqrt(x):
    ans = 1
    s = 1
    e = x/2
    while s<=e:
        mid = (s+e)//2
        if mid * mid == x:
            return round(mid)
        elif mid* mid < x:
            ans = mid
            s = mid +1
        else:
            e = mid -1
    return round(ans)