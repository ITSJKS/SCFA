def nextGreaterElement(arr):
    st = []
    ans = []

    for i in range(len(arr)-1 ,-1,-1):
        
        if not st : 
            st.append(-1)

        if st and st[-1] <= arr[i]:
            while st and st[-1] <= arr[i]:
                st.pop()
        # print(st , ans)
        if st :
            ans.append(st[-1])
        else:
            ans.append(-1)
        st.append(arr[i])
        # print(st)
        # print(ans)


    ans = ans[::-1]


    print(*ans)