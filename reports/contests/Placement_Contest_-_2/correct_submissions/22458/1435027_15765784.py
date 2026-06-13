def FindSqrt(x):
    s = 0
    e = x
    ans = -1
    while s <= e:
        mid = (s+e)//2
        if mid*mid <= x:
            ans = mid
            s=mid+1
        else:
            e = mid-1
    return ans
    # Complete the code here