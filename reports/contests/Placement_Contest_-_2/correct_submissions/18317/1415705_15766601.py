def min_speed(dist, hour):

    def find(m):
        ans = 0
        for i in dist:
            ans += i // m
            if ans > hour:
                ans += 1
            if i % m != 0:
                ans += 1
        return ans

    l = 1
    h = max(dist)

    ans = h
    while l <= h:
        m = (l+h)//2

        if find(m) <= hour:
            ans =m
            h = m-1
        else:
            l = m + 1

    return ans


    # s = 1
    # e = max(dist)

    # while s <= e:
    #     mid = (s + e) // 2

    #     hours = 0

    #     for elem in dist:
    #         hours += elem // mid
    #         if hours > hour:
    #             hours += 1
    #         if elem % mid != 0:
    #             hours += 1

    #     ans = e
    #     if hours <= hour:
    #         ans = mid 
    #         e = mid - 1
    #     else:
    #         s = mid + 1

    # return ans