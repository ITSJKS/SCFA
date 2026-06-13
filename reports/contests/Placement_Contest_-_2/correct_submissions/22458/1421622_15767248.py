def FindSqrt(x):
    if x < 2:
        return x

    s = 1
    e = x

    

    while (s <= e):
        mid = (s + e)//2
        # print(mid)
        
        if (mid*mid) == x:
            return mid

        elif (mid*mid) < x:
            s = mid + 1

        elif (mid*mid) > x:
            e = mid - 1
            
    return e