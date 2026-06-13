def FindSqrt(x):
    
    l, r = 1, x//2
    ans = 0
    if x < 2:
        return x
    while(l <= r):
        mid = (l+r)//2
        if mid <= (x//mid):
            ans = mid
            l = mid+1
        else:
            r = mid -1
    return ans