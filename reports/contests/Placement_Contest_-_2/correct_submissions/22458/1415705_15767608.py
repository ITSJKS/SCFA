def FindSqrt(x):
    s = 0
    e = (x//2)+1

    ans = e

    while s <= e:
        mid = (s + e) // 2
        
        if mid * mid <= x:
            ans = mid
            s = mid + 1    
        else:
            e = mid - 1
    return ans