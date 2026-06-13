def min_speed(dist, hour):
    l = 1
    r = max(dist)

    ans = r

    while (l <= r):
        mid = (l + r)//2

        hours = 0

        for elem in dist:
            hours += elem // mid
            if elem % mid != 0:
                hours += 1   

        if hours < hour:
            ans = mid
            r = mid - 1
        else:
            l = mid + 1

    return ans