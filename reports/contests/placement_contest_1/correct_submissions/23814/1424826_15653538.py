def firstOccurrence(nums):

    # rez = -1
    # n = len(nums)
    # for i in range(n):
    #     if nums[i] == 1:
    #         rez = i
    #         break
    
    # return rez


    i = 0
    j = len(nums)
    rez = -1
    n = 0
    while(j>i):

        mid = (i+j)//2
        # print(mid)

        if nums[mid] == 1:
            j = mid
            rez = mid
        else:
            i = mid
        # print(mid)


        n+=1
        if n==50:
            break
    # print("rez",rez)
    return rez