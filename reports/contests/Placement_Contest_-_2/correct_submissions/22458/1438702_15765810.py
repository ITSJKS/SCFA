def FindSqrt(x):
    start = 0
    end = x//2 + 1
    ans = 0
    while (start<=end):
        mid = (start+end)//2
        sqr = mid*mid
        if (sqr>x):
            end = mid-1
        elif(sqr<=x):
            ans = mid
            start = mid + 1
    return ans