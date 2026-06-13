def FindSqrt(x):
    if x == 0 or x == 1:
        return x
    start = 2
    end = x

    while start <= end:
        mid = (start+end)//2
        # print(start, mid, end)
        if (mid*mid) == x:
            return mid
        elif (mid*mid) > x:
            end = mid - 1
        else:
            start = mid + 1
    
    while (mid*mid)>x:
        mid -= 1
    return mid