def FindSqrt(x):
    if x < 2:
        return x
    s = 0
    e = x
    ans = 0
    
    
    while (s <= e):
        mid = (s + e)//2
        # print(mid)
        if mid  == x//mid:
           return mid
        elif  mid < x//mid:
            ans = mid
            s = mid + 1
        else:
            e = mid-1
    return ans