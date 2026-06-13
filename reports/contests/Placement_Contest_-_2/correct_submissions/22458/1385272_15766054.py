def FindSqrt(x):
    l = 0
    r = x
    res = -1

    while(l <= r):
        mid = (l+r) // 2
        
        if(mid*mid > x):
            r = mid - 1
        
        else:
            res = mid
            l = mid + 1

    return res